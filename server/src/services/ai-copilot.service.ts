import { PrismaClient } from "@prisma/client";
import { LLMService } from "./ai/llm.service";
import { AIContextService } from "./ai/ai-context.service";

const prisma = new PrismaClient();

export class AICopilotService {
  static async getUsageSummary(organizationId: string) {
    const requests = await prisma.aIRequest.findMany({
      where: { organizationId },
    });

    const totalRequests = requests.length;
    const totalTokens = requests.reduce((sum, req) => sum + req.tokens, 0);
    const successRate = totalRequests > 0 
      ? (requests.filter(r => r.status === "Success").length / totalRequests) * 100 
      : 0;

    return {
      totalRequests,
      totalTokens,
      successRate,
    };
  }

  static async getRecentRequests(organizationId: string) {
    return prisma.aIRequest.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }

  static async logRequest(organizationId: string, userId: string, feature: string, tokens: number, durationMs: number, status: string) {
    return prisma.aIRequest.create({
      data: {
        organizationId,
        requestedById: userId,
        feature,
        tokens,
        durationMs,
        status,
      },
    });
  }

  static async handleChat(organizationId: string, userId: string, message: string, contextIds?: any) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const llmResult = await LLMService.generateResponse(message, platformContext);
      
      tokens = llmResult.tokens;
      
      await this.logRequest(organizationId, userId, "Assistant Chat", tokens, Date.now() - startTime, status);
      
      return { response: llmResult.text };
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Assistant Chat", 0, Date.now() - startTime, status);
      throw error;
    }
  }

  static async generateEventDescription(
    organizationId: string, 
    userId: string, 
    payload: { eventName?: string; category?: string; audience?: string; theme?: string; duration?: string; additionalInstructions?: string }
  ) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const prompt = `You are an expert event copywriter. Generate a professional event description based on the following details.
Event Name: ${payload.eventName || 'N/A'}
Category: ${payload.category || 'N/A'}
Audience: ${payload.audience || 'N/A'}
Theme: ${payload.theme || 'N/A'}
Duration: ${payload.duration || 'N/A'}
Additional Instructions: ${payload.additionalInstructions || 'None'}

Please include the following sections (using markdown):
- Overview
- Objectives
- Who can participate
- What participants will do
- Expected outcomes`;

      const llmResult = await LLMService.generateResponse(prompt, platformContext);
      tokens = llmResult.tokens;
      
      await this.logRequest(organizationId, userId, "Event Description Generator", tokens, Date.now() - startTime, status);
      
      return { text: llmResult.text };
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Event Description Generator", 0, Date.now() - startTime, status);
      throw error;
    }
  }

  static async generateEventRules(
    organizationId: string, 
    userId: string, 
    payload: { eventName?: string; eventType?: string; category?: string; teamSize?: string; eligibility?: string; duration?: string; submissionType?: string; additionalInstructions?: string }
  ) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const prompt = `You are an expert event organizer and compliance officer. Generate a professional and structured set of event rules based on the following details. Do NOT invent specific dates or links unless provided.
Event Name: ${payload.eventName || 'N/A'}
Event Type/Category: ${payload.category || payload.eventType || 'N/A'}
Team Size: ${payload.teamSize || 'N/A'}
Eligibility: ${payload.eligibility || 'N/A'}
Duration: ${payload.duration || 'N/A'}
Submission Type: ${payload.submissionType || 'N/A'}
Additional Instructions: ${payload.additionalInstructions || 'None'}

Please include the following sections (using markdown format):
- Eligibility Rules
- Team Formation Rules
- Submission Guidelines
- Intellectual Property & Code of Conduct
- Evaluation Criteria
- Disqualification Terms`;

      const llmResult = await LLMService.generateResponse(prompt, platformContext);
      tokens = llmResult.tokens;
      
      await this.logRequest(organizationId, userId, "Event Rules Generator", tokens, Date.now() - startTime, status);
      
      return { text: llmResult.text };
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Event Rules Generator", 0, Date.now() - startTime, status);
      throw error;
    }
  }

  static async generateEvaluationRubric(
    organizationId: string,
    userId: string,
    payload: { goal: string; criteriaCount: number; difficulty: string; technicalWeight: number; businessWeight: number; eventName?: string; }
  ) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const prompt = `You are an expert judge and competition organizer. Generate a structured evaluation rubric.
Goal / Topic: ${payload.goal || 'General Competition'}
Event Name: ${payload.eventName || 'N/A'}
Number of Criteria: ${payload.criteriaCount}
Difficulty Level: ${payload.difficulty}
Emphasis: ${payload.technicalWeight}% Technical, ${payload.businessWeight}% Business/Impact

Generate EXACTLY valid JSON with the following structure. NO markdown formatting, NO backticks, just raw JSON:
{
  "criteria": [
    {
      "crit": "Criterion Name",
      "desc": "Detailed description of what to look for",
      "weight": 25,
      "range": "1-10"
    }
  ]
}
The total weight of all criteria MUST equal exactly 100.
`;

      const llmResult = await LLMService.generateResponse(prompt, platformContext);
      tokens = llmResult.tokens;
      
      // Parse JSON from output
      let jsonText = llmResult.text.trim();
      if (jsonText.startsWith('\`\`\`json')) {
        jsonText = jsonText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      } else if (jsonText.startsWith('\`\`\`')) {
        jsonText = jsonText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
      }
      
      const parsed = JSON.parse(jsonText);
      if (!parsed.criteria || !Array.isArray(parsed.criteria)) {
        throw new Error("Invalid structure returned by AI");
      }
      
      const totalWeight = parsed.criteria.reduce((acc: number, curr: any) => acc + (curr.weight || 0), 0);
      if (totalWeight !== 100) {
         // Normalize weights to 100
         const factor = 100 / totalWeight;
         parsed.criteria.forEach((c: any) => { c.weight = Math.round(c.weight * factor); });
         const newTotal = parsed.criteria.reduce((acc: number, curr: any) => acc + curr.weight, 0);
         if (newTotal !== 100) parsed.criteria[0].weight += (100 - newTotal);
      }
      
      await this.logRequest(organizationId, userId, "Evaluation Rubric Generator", tokens, Date.now() - startTime, status);
      return parsed;
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Evaluation Rubric Generator", 0, Date.now() - startTime, status);
      throw error;
    }
  }

  static async generateEmailTemplate(
    organizationId: string,
    userId: string,
    payload: { purpose: string; audience: string; tone: string; info: string; eventName?: string; }
  ) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const prompt = `You are a professional event communications manager. Generate an email template.
Event: ${payload.eventName || 'N/A'}
Purpose: ${payload.purpose}
Target Audience: ${payload.audience}
Tone: ${payload.tone}
Key Information to include:
${payload.info}

Generate EXACTLY valid JSON with the following structure. NO markdown formatting, NO backticks, just raw JSON:
{
  "subject": "The Email Subject Line",
  "body": "The full email body. Use placeholders like {Participant_Name} where appropriate."
}
`;

      const llmResult = await LLMService.generateResponse(prompt, platformContext);
      tokens = llmResult.tokens;
      
      let jsonText = llmResult.text.trim();
      if (jsonText.startsWith('\`\`\`json')) jsonText = jsonText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      else if (jsonText.startsWith('\`\`\`')) jsonText = jsonText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
      
      const parsed = JSON.parse(jsonText);
      await this.logRequest(organizationId, userId, "Email Template Generator", tokens, Date.now() - startTime, status);
      return parsed;
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Email Template Generator", 0, Date.now() - startTime, status);
      throw error;
    }
  }

  static async generateInsightsReport(
    organizationId: string,
    userId: string,
    payload: { reportType: string; eventId?: string; includeCharts: boolean; includeRecs: boolean }
  ) {
    const startTime = Date.now();
    let status = "Success";
    let tokens = 0;
    
    try {
      // Collect metrics
      const metrics: any = {
        totalEvents: await prisma.event.count({ where: { organizationId } }),
        totalRegistrations: await prisma.registration.count({ where: { event: { organizationId } } }),
        totalSubmissions: await prisma.submission.count({ where: { competition: { event: { organizationId } } } }),
        totalEvaluations: await prisma.evaluation.count({ where: { submission: { competition: { event: { organizationId } } } } }),
      };
      
      let verifiedEventId: string | null = null;
      if (payload.eventId && payload.eventId !== 'all') {
        const event = await prisma.event.findUnique({ where: { id: payload.eventId } });
        if (!event || event.organizationId !== organizationId) {
          throw new Error("403 Forbidden: Cannot access insights for this event.");
        }
        verifiedEventId = event.id;
        metrics.eventRegistrations = await prisma.registration.count({ where: { eventId: payload.eventId, event: { organizationId } } });
        metrics.eventSubmissions = await prisma.submission.count({ where: { competition: { eventId: payload.eventId, event: { organizationId } } } });
      }

      const platformContext = await AIContextService.getPlatformContext(organizationId);
      const prompt = `You are a data analyst generating an Insights Report for an event platform.
Report Type: ${payload.reportType}
Event Scope: ${payload.eventId === 'all' ? 'All Events YTD' : payload.eventId}
Include Charts Data: ${payload.includeCharts}
Include Recommendations: ${payload.includeRecs}

REAL DATABASE METRICS TO ANALYZE:
${JSON.stringify(metrics, null, 2)}

Do NOT invent metrics. Interpret ONLY the metrics provided above.

Generate EXACTLY valid JSON with the following structure. NO markdown formatting, NO backticks, just raw JSON:
{
  "summary": "Executive summary paragraph...",
  "highlights": ["highlight 1", "highlight 2"],
  "demographicsData": [
    { "label": "Group 1", "val": 40 },
    { "label": "Group 2", "val": 60 }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;

      const llmResult = await LLMService.generateResponse(prompt, platformContext);
      tokens = llmResult.tokens;
      
      let jsonText = llmResult.text.trim();
      if (jsonText.startsWith('\`\`\`json')) jsonText = jsonText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      else if (jsonText.startsWith('\`\`\`')) jsonText = jsonText.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
      
      const parsed = JSON.parse(jsonText);
      
      // Persist the report
      await prisma.aIInsightsReport.create({
        data: {
          organizationId,
          eventId: verifiedEventId,
          generatedById: userId,
          title: `Insights Report - ${payload.reportType}`,
          metricsSnapshot: metrics,
          report: parsed,
          model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        }
      });
      
      await this.logRequest(organizationId, userId, "Insights Report Generator", tokens, Date.now() - startTime, status);
      return parsed;
    } catch (error: any) {
      status = "Failed";
      await this.logRequest(organizationId, userId, "Insights Report Generator", 0, Date.now() - startTime, status);
      throw error;
    }
  }
}
