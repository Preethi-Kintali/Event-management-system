import { prisma } from "../utils/prisma";
import { EventStatus, ReportStatus } from "@prisma/client";
import { EventExecutionService } from "./event-execution.service";
import { LLMService } from "./ai/llm.service";

const generationLocks = new Set<string>();

export class FinalReportService {
  private static async verifyCoordinator(tenantId: string, eventId: string, userId: string) {
    const member = await prisma.eventTeamMember.findFirst({
      where: { eventId, userId, responsibility: 'Primary Student Coordinator' }
    });
    if (!member) {
      throw { status: 403, code: "FORBIDDEN", message: "Only the assigned Primary Student Coordinator can manage the final report." };
    }
    
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status !== 'COMPLETED') {
      throw { status: 403, code: "FORBIDDEN", message: "Final report is only available after the event is marked as COMPLETED." };
    }
  }

  static async getFinalReport(tenantId: string, eventId: string, onlyAssignedUserId?: string) {
    const whereClause: any = { eventId, organizationId: tenantId };
    
    // Authorization check
    if (onlyAssignedUserId) {
      const isAssigned = await prisma.eventTeamMember.findFirst({
        where: { eventId, userId: onlyAssignedUserId, responsibility: 'Primary Student Coordinator' }
      });
      if (!isAssigned) {
        throw { status: 403, code: "FORBIDDEN", message: "Unauthorized to view this report." };
      }
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.status !== 'COMPLETED') {
      throw { status: 403, code: "FORBIDDEN", message: "Final report is only available after the event is marked as COMPLETED." };
    }

    const report = await prisma.eventFinalReport.findUnique({
      where: { eventId }
    });

    return report;
  }

  static async saveDraft(tenantId: string, eventId: string, userId: string, data: any) {
    await this.verifyCoordinator(tenantId, eventId, userId);

    return prisma.eventFinalReport.upsert({
      where: { eventId },
      update: {
        executiveSummary: data.executiveSummary,
        eventOutcome: data.eventOutcome,
        keyHighlights: data.keyHighlights,
        challenges: data.challenges,
        recommendations: data.recommendations,
        additionalRemarks: data.additionalRemarks,
        supportingDocuments: data.supportingDocuments,
      },
      create: {
        eventId,
        organizationId: tenantId,
        coordinatorId: userId,
        executiveSummary: data.executiveSummary,
        eventOutcome: data.eventOutcome,
        keyHighlights: data.keyHighlights,
        challenges: data.challenges,
        recommendations: data.recommendations,
        additionalRemarks: data.additionalRemarks,
        supportingDocuments: data.supportingDocuments,
        status: ReportStatus.DRAFT,
      }
    });
  }

  static async generateAIDraft(tenantId: string, eventId: string, userId: string) {
    await this.verifyCoordinator(tenantId, eventId, userId);

    if (generationLocks.has(eventId)) {
      throw { status: 409, message: "Generation is already in progress." };
    }
    generationLocks.add(eventId);

    try {
      const event = await prisma.event.findFirst({
        where: { id: eventId, organizationId: tenantId },
        include: {
          proposal: true,
          competitions: { include: { winners: { include: { team: true, user: true, prize: true, submission: true } } } },
          teamMembers: { include: { user: true } },
        },
      });

      if (!event) throw { status: 404, message: "Event not found." };
      if (event.status !== EventStatus.COMPLETED) {
        throw { status: 400, message: "Event must be completed before generating." };
      }

      const report = await prisma.eventFinalReport.findUnique({ where: { eventId } });
      if (!report) {
        throw { status: 400, message: "Draft report not found. Please save a draft first." };
      }

      const executionSummary = await EventExecutionService.getExecutionSummary(tenantId, eventId);

      const prompt = `
You are an analytical report generator. 
Generate a professional final event report in markdown format.

CRITICAL INSTRUCTIONS - NO HALLUCINATION:
- Use ONLY the exact event data, metrics, and coordinator inputs provided below.
- DO NOT invent, guess, or extrapolate ANY metrics, participant counts, winners, sponsors, dates, financial amounts, achievements, or activities.
- DO NOT include placeholder text. If a specific piece of information (e.g. winners, sponsors, achievements) is not present in the data below, you MUST state "Not provided" or "Information was not provided."
- STICK STRICTLY to the facts provided.

REQUIRED REPORT STRUCTURE:
# FINAL EVENT REPORT
1. Executive Summary
2. Event Overview
3. Objectives
4. Event Execution
5. Participation & Statistics
6. Key Highlights
7. Outcomes
8. Challenges & Resolutions
9. Recommendations
10. Supporting Documents
11. Conclusion

Context Data:
- Event Name: ${event.name}
- Event Dates: ${event.startTime} to ${event.endTime}
- Venue: Not provided
- Event Type: Not provided
- Department/Organizer: Not provided

Coordinator Inputs:
- Executive Summary: ${report.executiveSummary || 'Not provided'}
- Objectives: Not explicitly provided.
- Outcomes: ${report.eventOutcome || 'Not provided'}
- Key Highlights: ${report.keyHighlights || 'Not provided'}
- Challenges & Resolutions: ${report.challenges || 'Not provided'}
- Recommendations: ${report.recommendations || 'Not provided'}

Execution Summary (DB Metrics):
${JSON.stringify(executionSummary, null, 2)}

Please write the comprehensive final report using the exact requested structure, blending the coordinator's inputs with the hard data.
      `;

      const aiResponse = await LLMService.generateResponse(prompt);

      return prisma.eventFinalReport.update({
        where: { eventId },
        data: {
          aiGeneratedContent: aiResponse.text,
          finalizedContent: aiResponse.text, // initial state is the AI's version
          status: ReportStatus.AI_GENERATED
        }
      });
    } finally {
      generationLocks.delete(eventId);
    }
  }

  static async finalizeReport(tenantId: string, eventId: string, userId: string, finalizedContent: string) {
    await this.verifyCoordinator(tenantId, eventId, userId);

    const report = await prisma.eventFinalReport.findUnique({ where: { eventId } });
    if (!report || report.status === ReportStatus.DRAFT) {
      throw { status: 400, message: "Report must be AI generated before finalizing." };
    }

    return prisma.eventFinalReport.update({
      where: { eventId },
      data: {
        finalizedContent,
        status: ReportStatus.FINALIZED
      }
    });
  }
}
