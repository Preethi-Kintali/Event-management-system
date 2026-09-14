import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api-client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/platform-admin/all-proposals')({
  component: AllProposalsComponent,
});

function AllProposalsComponent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const permissions = user?.memberships?.[0]?.role?.permissions?.map(p => p.permission.action) || [];
  const canCreateEvent = permissions.includes('hackathon_proposals.create_event');

  const { data: response, isLoading } = useQuery({
    queryKey: ['all-proposals'],
    queryFn: async () => {
      const res = await fetchApi('/hackathon-proposals');
      return res.data;
    },
  });

  const proposals = response || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredProposals = proposals.filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Proposals</h1>
      <p className="text-gray-500 mb-6">View all proposals across the platform.</p>
      
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search proposals by title..."
          className="flex-1 border p-2 rounded bg-background text-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="border p-2 rounded bg-background text-foreground"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED_TO_MANAGER">Submitted to Manager</option>
          <option value="CHANGES_REQUESTED">Changes Requested</option>
          <option value="SUBMITTED_TO_PRINCIPAL">Submitted to Principal</option>
          <option value="PRINCIPAL_APPROVED">Principal Approved</option>
          <option value="EVENT_CREATED">Event Created</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <button 
          onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear
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
                    <p className="text-sm font-medium mt-1 text-blue-600">Status: {p.status}</p>
                  </div>
                  <Link to="/hackathon-proposals/$id" params={{ id: p.id }} className="text-blue-600 hover:underline text-sm font-medium">
                    View Full Details
                  </Link>
                </div>
                <div className="flex gap-2">
                  {p.status === 'PRINCIPAL_APPROVED' && canCreateEvent && (
                    <Link 
                      to="/events/new"
                      search={{ proposalId: p.id }}
                      className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 font-semibold"
                    >
                      Create Event
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
