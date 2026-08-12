import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Plus, Download, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListPageTemplate } from "@/components/templates/list-page";
import { StatusChip } from "@/components/ds/status-chip";
import type { Column } from "@/components/ds/data-table";
import { useCertificates, useDeleteCertificate } from "../services/certificates.api";
import { Certificate } from "../types/certificate.types";
import { CertificateCreateDialog } from "../components/certificate-create-dialog";
import { CertificateBulkIssueDialog } from "../components/certificate-bulk-issue-dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export function CertificateList() {
  const [createOpen, setCreateOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const router = useRouter();
  
  const { data: certificates = [], isLoading } = useCertificates();
  const deleteMutation = useDeleteCertificate();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this certificate? This action cannot be undone.")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Certificate deleted successfully"),
        onError: () => toast.error("Failed to delete certificate"),
      });
    }
  };

  const columns: Column<Certificate>[] = [
    {
      key: "recipient",
      header: "Recipient",
      sortable: true,
      render: (row) => (
        <span className="font-medium">
          {row.user?.firstName} {row.user?.lastName}
        </span>
      ),
    },
    { 
      key: "type", 
      header: "Type", 
      sortable: true,
      render: (row) => <span className="text-sm">{row.type.replace('_', ' ')}</span>
    },
    { 
      key: "event", 
      header: "Event", 
      sortable: true,
      render: (row) => <span className="text-sm truncate max-w-[150px] inline-block">{row.event?.name}</span>
    },
    {
      key: "certificateNumber",
      header: "Serial",
      sortable: true,
      render: (row) => <span className="font-mono text-xs">{row.certificateNumber}</span>,
    },
    { 
      key: "issuedAt", 
      header: "Issued", 
      sortable: true,
      render: (row) => <span className="text-sm">{format(new Date(row.issuedAt), 'MMM d, yyyy')}</span>
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusChip status={row.status === 'ISSUED' ? 'active' : 'suspended'} label={row.status} />,
    },
  ];

  return (
    <>
      <ListPageTemplate<Certificate>
        title="Certificates"
        description="Issue, manage and verify digital certificates for events and competitions."
        crumbs={[{ label: "Certificates" }]}
        columns={columns}
        rows={certificates}
        searchKeys={["certificateNumber", "title"]}
        facet={{
          label: "Type",
          key: "type",
          options: ["PARTICIPATION", "COMPLETION", "WINNER", "FINALIST", "JUDGE", "MENTOR", "VOLUNTEER"],
        }}
        createLabel="Issue single"
        onCreate={() => setCreateOpen(true)}
        headerActions={
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            Bulk issue
          </Button>
        }
        rowActions={[
          {
            label: "View details",
            onSelect: (row) => router.navigate({ to: `/certificates/${row.id}` }),
          },
          {
            label: "Delete",
            onSelect: (row) => handleDelete(row.id),
          },
        ]}
      />

      <CertificateCreateDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />
      <CertificateBulkIssueDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
      />
    </>
  );
}
