import { ListPageTemplate } from "@/components/templates/list-page";
import { useManagerCertificates } from "../hooks/manager.api";

export function ManagerCertificatesPage() {
  const { data = [], isLoading } = useManagerCertificates();

  return (
    <ListPageTemplate<any>
      title="Managed Certificates"
      description="View certificates you manage."
      crumbs={[{ label: "Manager" }, { label: "Certificates" }]}
      columns={[
        { key: "user", header: "Recipient", render: (row) => <span className="font-medium">{row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() : row.userId}</span> },
        { key: "type", header: "Type", render: (row) => <span>{row.type}</span> },
        { key: "issuedAt", header: "Issued On", render: (row) => <span>{new Date(row.issuedAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["userId", "type"]}
    />
  );
}
