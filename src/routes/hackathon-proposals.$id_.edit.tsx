import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/hackathon-proposals/$id_/edit')({
  component: EditProposalComponent,
});

function EditProposalComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['proposal', id],
    queryFn: async () => {
      const res = await fetchApi(`/hackathon-proposals/${id}`);
      return res.data;
    },
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expectedParticipants: 0,
    estimatedBudget: 0,
    requiredManpower: 0,
    estimatedWorkingHours: 0,
  });

  useEffect(() => {
    if (response) {
      setFormData({
        title: response.title || '',
        description: response.description || '',
        expectedParticipants: response.expectedParticipants || 0,
        estimatedBudget: response.estimatedBudget || 0,
        requiredManpower: response.requiredManpower || 0,
        estimatedWorkingHours: response.estimatedWorkingHours || 0,
      });
    }
  }, [response]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetchApi(`/hackathon-proposals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...data,
          expectedParticipants: Number(data.expectedParticipants),
          estimatedBudget: Number(data.estimatedBudget),
          requiredManpower: Number(data.requiredManpower),
          estimatedWorkingHours: Number(data.estimatedWorkingHours),
        })
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Proposal updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['proposal', id] });
      queryClient.invalidateQueries({ queryKey: ['my-proposals'] });
      navigate({ to: `/hackathon-proposals/${id}` });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update proposal");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  const proposal = response;
  if (!proposal) return <div className="p-6">Proposal not found.</div>;
  if (proposal.status !== 'DRAFT' && proposal.status !== 'CHANGES_REQUESTED') {
    return <div className="p-6 text-red-500 font-medium">You cannot edit a proposal that is not in DRAFT or CHANGES_REQUESTED state.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Hackathon Proposal</h1>
        <button 
          onClick={() => navigate({ to: `/hackathon-proposals/${id}` })}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input 
            required 
            type="text" 
            className="w-full border p-2 rounded" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            className="w-full border p-2 rounded" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expected Participants</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded" 
              value={formData.expectedParticipants} 
              onChange={e => setFormData({...formData, expectedParticipants: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Budget</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded" 
              value={formData.estimatedBudget} 
              onChange={e => setFormData({...formData, estimatedBudget: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Required Manpower</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded" 
              value={formData.requiredManpower} 
              onChange={e => setFormData({...formData, requiredManpower: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Working Hours</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded" 
              value={formData.estimatedWorkingHours} 
              onChange={e => setFormData({...formData, estimatedWorkingHours: Number(e.target.value)})} 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={updateMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
