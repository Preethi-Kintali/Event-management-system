import { CommunityRepository } from "../repositories/community.repository";
import { AuditService } from "./audit.service";
import { CommunityGroup, GroupMembership, Discussion, DiscussionReply } from "@prisma/client";

export class CommunityService {
  static async getGroups(organizationId: string): Promise<CommunityGroup[]> {
    return CommunityRepository.findGroups(organizationId);
  }

  static async getGroupById(id: string, organizationId: string): Promise<CommunityGroup | null> {
    return CommunityRepository.findGroupById(id, organizationId);
  }

  static async createGroup(data: any, organizationId: string, actorId: string): Promise<CommunityGroup> {
    const group = await CommunityRepository.createGroup({
      ...data,
      organizationId,
    });
    await AuditService.log(organizationId, actorId, "GROUP_CREATE", group.id);
    return group;
  }

  static async updateGroup(id: string, data: any, organizationId: string, actorId: string): Promise<CommunityGroup> {
    const group = await CommunityRepository.updateGroup(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "GROUP_UPDATE", group.id);
    return group;
  }

  static async deleteGroup(id: string, organizationId: string, actorId: string): Promise<void> {
    await CommunityRepository.deleteGroup(id, organizationId);
    await AuditService.log(organizationId, actorId, "GROUP_DELETE", id);
  }

  static async getMemberships(groupId: string, organizationId: string): Promise<GroupMembership[]> {
    return CommunityRepository.findMemberships(groupId, organizationId);
  }

  static async joinGroup(groupId: string, userId: string, organizationId: string): Promise<GroupMembership> {
    const group = await CommunityRepository.findGroupById(groupId, organizationId);
    if (!group) throw { status: 404, code: "NOT_FOUND", message: "Group not found" };

    return CommunityRepository.createMembership({
      groupId,
      userId,
    });
  }

  static async leaveGroup(groupId: string, userId: string, organizationId: string): Promise<void> {
    const group = await CommunityRepository.findGroupById(groupId, organizationId);
    if (!group) throw { status: 404, code: "NOT_FOUND", message: "Group not found" };

    await CommunityRepository.deleteMembership(groupId, userId);
  }

  static async getDiscussions(organizationId: string): Promise<Discussion[]> {
    return CommunityRepository.findDiscussions(organizationId);
  }

  static async getDiscussionById(id: string, organizationId: string): Promise<Discussion | null> {
    return CommunityRepository.findDiscussionById(id, organizationId);
  }

  static async createDiscussion(data: any, organizationId: string, actorId: string): Promise<Discussion> {
    const discussion = await CommunityRepository.createDiscussion({
      ...data,
      organizationId,
      authorId: actorId,
    });
    await AuditService.log(organizationId, actorId, "DISCUSSION_CREATE", discussion.id);
    return discussion;
  }

  static async updateDiscussion(id: string, data: any, organizationId: string, actorId: string): Promise<Discussion> {
    const discussion = await CommunityRepository.updateDiscussion(id, organizationId, data);
    await AuditService.log(organizationId, actorId, "DISCUSSION_UPDATE", discussion.id);
    return discussion;
  }

  static async deleteDiscussion(id: string, organizationId: string, actorId: string): Promise<void> {
    await CommunityRepository.deleteDiscussion(id, organizationId);
    await AuditService.log(organizationId, actorId, "DISCUSSION_DELETE", id);
  }

  static async replyToDiscussion(discussionId: string, content: string, organizationId: string, actorId: string): Promise<DiscussionReply> {
    const discussion = await CommunityRepository.findDiscussionById(discussionId, organizationId);
    if (!discussion) throw { status: 404, code: "NOT_FOUND", message: "Discussion not found" };

    const reply = await CommunityRepository.createReply({
      discussionId,
      content,
      authorId: actorId,
    });
    return reply;
  }

  static async getDashboardStats(organizationId: string) {
    const groups = await CommunityRepository.findGroups(organizationId);
    const discussions = await CommunityRepository.findDiscussions(organizationId);
    
    let totalMembers = 0;
    groups.forEach(g => {
      totalMembers += g._count?.members || 0;
    });

    let totalReplies = 0;
    let activeDiscussions = 0;
    discussions.forEach(d => {
      totalReplies += d._count?.replies || 0;
      if (d.status === "OPEN") {
        activeDiscussions++;
      }
    });

    return {
      members: totalMembers,
      groups: groups.length,
      discussions: discussions.length,
      activeDiscussions,
      engagementRate: discussions.length > 0 ? Number((totalReplies / discussions.length).toFixed(1)) : 0,
    };
  }
}
