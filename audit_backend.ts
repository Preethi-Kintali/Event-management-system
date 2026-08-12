import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "server/src");
const ROUTES_DIR = path.join(SRC_DIR, "routes");
const CONTROLLERS_DIR = path.join(SRC_DIR, "controllers");
const SERVICES_DIR = path.join(SRC_DIR, "services");
const REPOS_DIR = path.join(SRC_DIR, "repositories");

function getFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".ts"));
}

const modules = [
  "auth", "organizations", "users", "roles", "permissions", // 3A, 3B
  "events", "competitions", "registrations", "teams", "submissions", // 3C
  "evaluations", "judges", "mentors", "volunteers", "attendance", // 3D
  "certificates", // 4A
  "communications", "notifications", // 4B
  "winners", "badges", // 4C
  "learning", "community", "feedback", "recruitment", "sponsors" // 4D
];

const results: any[] = [];

for (const mod of modules) {
  const hasRoute = fs.existsSync(path.join(ROUTES_DIR, `${mod}.routes.ts`));
  const hasController = fs.existsSync(path.join(CONTROLLERS_DIR, `${mod}.controller.ts`));
  const hasService = fs.existsSync(path.join(SERVICES_DIR, `${mod}.service.ts`));
  const hasRepo = fs.existsSync(path.join(REPOS_DIR, `${mod}.repository.ts`));
  
  let routeContent = "";
  if (hasRoute) {
    routeContent = fs.readFileSync(path.join(ROUTES_DIR, `${mod}.routes.ts`), "utf8");
  }

  const endpoints = [];
  if (routeContent) {
    const regex = /router\.(get|post|put|patch|delete)\(['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(routeContent)) !== null) {
      endpoints.push(`${match[1].toUpperCase()} ${match[2]}`);
    }
  }

  results.push({
    module: mod,
    route: hasRoute,
    controller: hasController,
    service: hasService,
    repo: hasRepo,
    endpoints: endpoints.length
  });
}

fs.writeFileSync("audit_backend.json", JSON.stringify(results, null, 2));
console.log("Backend audit complete.");
