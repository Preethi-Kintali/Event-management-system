import { PrismaClient, Survey, SurveyQuestion, SurveyResponse } from "@prisma/client";

const prisma = new PrismaClient();

export class FeedbackRepository {
  // Surveys
  static async findSurveys(organizationId: string): Promise<Survey[]> {
    return prisma.survey.findMany({
      where: { organizationId },
      include: {
        _count: { select: { responses: true, questions: true } },
      },
    });
  }

  static async findSurveyById(id: string, organizationId: string): Promise<Survey | null> {
    return prisma.survey.findUnique({
      where: { id, organizationId },
      include: {
        questions: { orderBy: { order: "asc" } },
        _count: { select: { responses: true } },
      },
    });
  }

  static async createSurvey(data: Omit<Survey, "id" | "createdAt" | "updatedAt">): Promise<Survey> {
    return prisma.survey.create({ data });
  }

  static async updateSurvey(id: string, organizationId: string, data: Partial<Survey>): Promise<Survey> {
    return prisma.survey.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteSurvey(id: string, organizationId: string): Promise<void> {
    await prisma.survey.delete({ where: { id, organizationId } });
  }

  // Questions
  static async createQuestion(data: Omit<SurveyQuestion, "id">): Promise<SurveyQuestion> {
    return prisma.surveyQuestion.create({ data });
  }

  static async deleteQuestion(id: string): Promise<void> {
    await prisma.surveyQuestion.delete({ where: { id } });
  }

  // Responses
  static async findResponses(surveyId: string): Promise<SurveyResponse[]> {
    return prisma.surveyResponse.findMany({
      where: { surveyId },
      include: { participant: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createResponse(data: Omit<SurveyResponse, "id" | "createdAt">): Promise<SurveyResponse> {
    return prisma.surveyResponse.create({ data });
  }

  static async findFeedbackList(organizationId: string): Promise<SurveyResponse[]> {
    return prisma.surveyResponse.findMany({
      where: { survey: { organizationId } },
      include: {
        participant: { select: { firstName: true, lastName: true } },
        survey: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findFeedbackById(id: string, organizationId: string): Promise<SurveyResponse | null> {
    return prisma.surveyResponse.findUnique({
      where: { id, survey: { organizationId } },
      include: {
        participant: { select: { firstName: true, lastName: true } },
        survey: { select: { name: true } },
      },
    });
  }
}
