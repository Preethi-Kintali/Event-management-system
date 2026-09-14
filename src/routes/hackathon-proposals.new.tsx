import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api-client';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/hackathon-proposals/new')({
  component: NewProposalComponent,
});

function NewProposalComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expectedParticipants: 0,
    estimatedBudget: 0,
    requiredManpower: 0,
    estimatedWorkingHours: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetchApi('/hackathon-proposals', {
        method: 'POST',
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
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['my-proposals'] });
      toast.success("Draft created successfully!");
      navigate({ to: '/hackathon-proposals/$id', params: { id: res.id } });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create draft");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Hackathon Proposal</h1>
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Required Manpower</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded bg-background text-foreground" 
              value={formData.requiredManpower} 
              onChange={e => setFormData({...formData, requiredManpower: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Working Hours</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded bg-background text-foreground" 
              value={formData.estimatedWorkingHours} 
              onChange={e => setFormData({...formData, estimatedWorkingHours: Number(e.target.value)})} 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={createMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4"
        >
          {createMutation.isPending ? 'Saving...' : 'Create Draft'}
        </button>
      </form>
    </div>
  );
}
