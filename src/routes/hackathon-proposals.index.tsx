import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api-client';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/hackathon-proposals/')({
  component: HackathonProposalsComponent,
});

function HackathonProposalsComponent() {
  const { data: response, isLoading } = useQuery({
    queryKey: ['my-proposals'],
    queryFn: async () => {
      const res = await fetchApi('/hackathon-proposals/my');
      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/hackathon-proposals/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-proposals'] });
      toast.success('Proposal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete proposal');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this proposal?')) {
      deleteMutation.mutate(id);
    }
  };

  const proposals = response || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const filteredProposals = proposals.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isActive = ['DRAFT', 'SUBMITTED_TO_MANAGER', 'CHANGES_REQUESTED', 'SUBMITTED_TO_PRINCIPAL', 'PRINCIPAL_APPROVED', 'EVENT_CREATED'].includes(p.status);
    if (!showHistory && !isActive) return false;
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Hackathon Proposals</h1>
        <Link to="/hackathon-proposals/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Proposal
        </Link>
      </div>

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
              <div key={p.id} className="border p-4 rounded bg-card shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-500">Status: {p.status}</p>
                </div>
                <div className="flex items-center gap-4">
                  {(p.status === 'DRAFT' || p.status === 'CHANGES_REQUESTED') && (
                    <>
                      <a href={`/hackathon-proposals/${p.id}/edit`} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                        Edit
                      </a>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <Link to="/hackathon-proposals/$id" params={{ id: p.id }} className="text-blue-600 hover:underline font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
