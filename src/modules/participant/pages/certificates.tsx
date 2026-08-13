import { ListPageTemplate } from "@/components/templates/list-page";
import { useMyCertificates } from "../hooks/participant.api";

export function ParticipantCertificatesPage() {
  const { data = [], isLoading } = useMyCertificates();

  return (
    <ListPageTemplate<any>
      title="My Certificates"
      description="View your certificates."
      crumbs={[{ label: "Participant" }, { label: "Certificates" }]}
      columns={[
        { key: "type", header: "Type", render: (row) => <span className="font-medium">{row.type || 'Certificate'}</span> },
        { key: "event", header: "Event", render: (row) => <span>{row.event?.name || 'N/A'}</span> },
        { key: "issuedAt", header: "Issued On", render: (row) => <span>{new Date(row.issuedAt).toLocaleDateString()}</span> },
      ]}
      rows={data}
      loading={isLoading}
      searchKeys={["type"]}
    />
  );
}
