import { PrismaClient, CommunityGroup, GroupMembership, Discussion, DiscussionReply } from "@prisma/client";

const prisma = new PrismaClient();

export class CommunityRepository {
  // Groups
  static async findGroups(organizationId: string): Promise<CommunityGroup[]> {
    return prisma.communityGroup.findMany({
      where: { organizationId },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  static async findGroupById(id: string, organizationId: string): Promise<CommunityGroup | null> {
    return prisma.communityGroup.findUnique({
      where: { id, organizationId },
      include: {
        _count: { select: { members: true } },
      },
    });
  }

  static async createGroup(data: Omit<CommunityGroup, "id" | "createdAt" | "updatedAt">): Promise<CommunityGroup> {
    return prisma.communityGroup.create({ data });
  }

  static async updateGroup(id: string, organizationId: string, data: Partial<CommunityGroup>): Promise<CommunityGroup> {
    return prisma.communityGroup.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteGroup(id: string, organizationId: string): Promise<void> {
    await prisma.communityGroup.delete({ where: { id, organizationId } });
  }

  // Group Memberships
  static async findMemberships(groupId: string, organizationId: string): Promise<GroupMembership[]> {
    const group = await prisma.communityGroup.findUnique({ where: { id: groupId, organizationId } });
    if (!group) return [];
    return prisma.groupMembership.findMany({
      where: { groupId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  static async createMembership(data: Omit<GroupMembership, "id" | "joinedAt">): Promise<GroupMembership> {
    return prisma.groupMembership.create({ data });
  }

  static async deleteMembership(groupId: string, userId: string): Promise<void> {
    await prisma.groupMembership.delete({
      where: { groupId_userId: { groupId, userId } },
    });
  }

  // Discussions
  static async findDiscussions(organizationId: string): Promise<Discussion[]> {
    return prisma.discussion.findMany({
      where: { organizationId },
      include: {
        author: { select: { firstName: true, lastName: true } },
        _count: { select: { replies: true } },
      },
    });
  }

  static async findDiscussionById(id: string, organizationId: string): Promise<Discussion | null> {
    return prisma.discussion.findUnique({
      where: { id, organizationId },
      include: {
        author: { select: { firstName: true, lastName: true } },
        _count: { select: { replies: true } },
        replies: {
          include: {
            author: { select: { firstName: true, lastName: true } }
          }
        }
      },
    });
  }

  static async createDiscussion(data: Omit<Discussion, "id" | "views" | "likes" | "createdAt" | "updatedAt">): Promise<Discussion> {
    return prisma.discussion.create({ data });
  }

  static async updateDiscussion(id: string, organizationId: string, data: Partial<Discussion>): Promise<Discussion> {
    return prisma.discussion.update({
      where: { id, organizationId },
      data,
    });
  }

  static async deleteDiscussion(id: string, organizationId: string): Promise<void> {
    await prisma.discussion.delete({ where: { id, organizationId } });
  }

  // Replies
  static async createReply(data: Omit<DiscussionReply, "id" | "likes" | "createdAt" | "updatedAt">): Promise<DiscussionReply> {
    return prisma.discussionReply.create({ data });
  }
}
