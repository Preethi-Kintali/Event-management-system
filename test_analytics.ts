import { AnalyticsService } from "./server/src/services/analytics.service";
import { prisma } from "./server/src/utils/prisma";

async function test() {
  try {
    const tenant = await prisma.organization.findFirst();
    if (!tenant) {
      console.log("No tenant found");
      return;
    }
    const result = await AnalyticsService.getRevenueAnalytics(tenant.id);
    console.log("SUCCESS:", result);
  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
