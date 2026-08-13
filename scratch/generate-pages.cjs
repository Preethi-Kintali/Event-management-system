const fs = require('fs');
const path = require('path');

const managerPages = [
  'registrations', 'teams', 'submissions', 'evaluations', 'judges',
  'mentors', 'volunteers', 'attendance', 'certificates', 'reports'
];

const participantPages = [
  'registrations', 'teams', 'submissions', 'certificates', 'achievements', 'notifications'
];

function generateManagerPage(name) {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);
  return `import { ListPageTemplate } from "@/components/templates/list-page";
import { useManager${Name} } from "../hooks/manager.api";

export function Manager${Name}Page() {
  const { data = [], isLoading } = useManager${Name}();

  return (
    <ListPageTemplate<any>
      title="Managed ${Name}"
      description="View ${name} you manage."
      crumbs={[{ label: "Manager" }, { label: "${Name}" }]}
      columns={[{ key: "id", header: "ID", render: (row) => <span>{row.id}</span> }]}
      rows={data}
      loading={isLoading}
      searchKeys={["id"]}
    />
  );
}
`;
}

function generateParticipantPage(name) {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);
  return `import { ListPageTemplate } from "@/components/templates/list-page";
import { useMy${Name} } from "../hooks/participant.api";

export function Participant${Name}Page() {
  const { data = [], isLoading } = useMy${Name}();

  return (
    <ListPageTemplate<any>
      title="My ${Name}"
      description="View your ${name}."
      crumbs={[{ label: "Participant" }, { label: "${Name}" }]}
      columns={[{ key: "id", header: "ID", render: (row) => <span>{row.id}</span> }]}
      rows={data}
      loading={isLoading}
      searchKeys={["id"]}
    />
  );
}
`;
}

function generateRouteFile(role, name, componentName) {
  return `import { createFileRoute } from "@tanstack/react-router";
import { ${componentName} } from "@/modules/${role}/pages/${name}";

export const Route = createFileRoute("/${role}/${name}")({
  head: () => ({ meta: [{ title: "${componentName} · Ascent Platform" }] }),
  component: ${componentName},
});
`;
}

// Generate Manager Pages and Routes
for (const page of managerPages) {
  fs.writeFileSync(path.join(__dirname, `../src/modules/manager/pages/${page}.tsx`), generateManagerPage(page));
  fs.writeFileSync(path.join(__dirname, `../src/routes/manager.${page}.tsx`), generateRouteFile('manager', page, `Manager${page.charAt(0).toUpperCase() + page.slice(1)}Page`));
}
// Generate Participant Pages and Routes
for (const page of participantPages) {
  fs.writeFileSync(path.join(__dirname, `../src/modules/participant/pages/${page}.tsx`), generateParticipantPage(page));
  fs.writeFileSync(path.join(__dirname, `../src/routes/participant.${page}.tsx`), generateRouteFile('participant', page, `Participant${page.charAt(0).toUpperCase() + page.slice(1)}Page`));
}

// Ensure the events routes are generated too since we manually created the pages
fs.writeFileSync(path.join(__dirname, `../src/routes/manager.events.tsx`), generateRouteFile('manager', 'events', 'ManagerEventsPage'));
fs.writeFileSync(path.join(__dirname, `../src/routes/participant.discover-events.tsx`), generateRouteFile('participant', 'discover-events', 'ParticipantDiscoverEventsPage'));

console.log("Pages and routes generated successfully.");
