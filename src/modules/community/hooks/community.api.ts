import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { CommunityGroup, GroupMembership, Discussion, DiscussionReply } from "@prisma/client";

// Dashboard
export function useCommunityDashboard() {
  return useQuery({
    queryKey: ["community", "dashboard"],
    queryFn: () => fetchApi<{ success: boolean; data: any }>("/api/v1/community/dashboard").then(r => r.data),
  });
}

// Groups
export function useGroups() {
  return useQuery({
    queryKey: ["community", "groups"],
    queryFn: () => fetchApi<{ success: boolean; data: CommunityGroup[] }>("/api/v1/community/groups").then(r => r.data),
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["community", "groups", id],
    queryFn: () => fetchApi<{ success: boolean; data: CommunityGroup }>(`/api/v1/community/groups/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

// Group Memberships
export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["community", "groups", groupId, "members"],
    queryFn: () => fetchApi<{ success: boolean; data: GroupMembership[] }>(`/api/v1/community/groups/${groupId}/members`).then(r => r.data),
    enabled: !!groupId,
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => fetchApi(`/api/v1/community/groups/${groupId}/join`, { method: "POST" }),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ["community", "groups"] });
      queryClient.invalidateQueries({ queryKey: ["community", "groups", groupId] });
      queryClient.invalidateQueries({ queryKey: ["community", "groups", groupId, "members"] });
    },
  });
}

// Discussions
export function useDiscussions() {
  return useQuery({
    queryKey: ["community", "discussions"],
    queryFn: () => fetchApi<{ success: boolean; data: Discussion[] }>("/api/v1/community/discussions").then(r => r.data),
  });
}

export function useDiscussion(id: string) {
  return useQuery({
    queryKey: ["community", "discussions", id],
    queryFn: () => fetchApi<{ success: boolean; data: Discussion }>(`/api/v1/community/discussions/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useReplyDiscussion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ discussionId, content }: { discussionId: string; content: string }) => 
      fetchApi(`/api/v1/community/discussions/${discussionId}/replies`, { 
        method: "POST", 
        body: JSON.stringify({ content }) 
      }),
    onSuccess: (_, { discussionId }) => {
      queryClient.invalidateQueries({ queryKey: ["community", "discussions", discussionId] });
    },
  });
}
