import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api-client';
import { useState } from 'react';

export const Route = createFileRoute('/manager/proposals')({
  component: ManagerProposalsComponent,
});

function ManagerProposalsComponent() {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['manager-proposals'],
    queryFn: async () => {
      const res = await fetchApi('/hackathon-proposals/manager/pending');
      return res.data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, comment }: { id: string, action: string, comment?: string }) => {
      const body: any = { action };
      if (comment) body.comment = comment;
      await fetchApi(`/hackathon-proposals/${id}/manager-review`, { 
        method: 'POST', 
        body: JSON.stringify(body) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['my-proposals'] });
      queryClient.invalidateQueries({ queryKey: ['approved-proposals'] });
    },
  });

  const handleReview = (id: string, action: string) => {
    const comment = prompt(`Enter optional comment for ${action}:`);
    if (comment) {
      reviewMutation.mutate({ id, action, comment });
    } else {
      reviewMutation.mutate({ id, action });
    }
  };

  const proposals = response || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const filteredProposals = proposals.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isActive = p.status === 'SUBMITTED_TO_MANAGER';
    if (!showHistory && !isActive) return false;
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Review Queue</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search proposals by title..."
          className="flex-1 border p-2 rounded bg-background text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => setSearchTerm('')}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear Search
        </button>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {filteredProposals.length === 0 ? (
            <p>No proposals found.</p>
          ) : (
            filteredProposals.map((p: any) => (
              <div key={p.id} className="border p-4 rounded bg-card shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-500">Submitted by: {p.submittedBy?.firstName} {p.submittedBy?.lastName}</p>
                    <p className="text-sm font-medium mt-1">Status: {p.status}</p>
                  </div>
                  <Link to="/hackathon-proposals/$id" params={{ id: p.id }} className="text-blue-600 hover:underline text-sm">
                    View Full Details
                  </Link>
                </div>
                {p.status === 'SUBMITTED_TO_MANAGER' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReview(p.id, 'APPROVE')} 
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReview(p.id, 'REQUEST_CHANGES')} 
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Request Changes
                    </button>
                    <button 
                      onClick={() => handleReview(p.id, 'REJECT')} 
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
