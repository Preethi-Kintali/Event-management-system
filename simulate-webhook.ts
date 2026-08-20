import { PrismaClient } from '@prisma/client';
import { PaymentsService } from './server/src/services/payments.service';

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.findFirst({ where: { name: "Premium Tech Conference 2026" } });
  const user = await prisma.user.findFirst();
  
  if (!event || !user) return console.log("Missing event or user");

  // Create Registration and Payment manually to bypass the Stripe Checkout error
  const registration = await prisma.registration.upsert({
    where: { eventId_userId: { eventId: event.id, userId: user.id } },
    update: { status: "PENDING" },
    create: { eventId: event.id, userId: user.id, status: "PENDING" }
  });

  const providerId = "cs_test_simulate123" + Date.now();
  const payment = await prisma.payment.upsert({
    where: { registrationId: registration.id },
    update: { status: "PENDING", providerPaymentId: providerId },
    create: {
      organizationId: event.organizationId,
      amount: event.price,
      currency: event.currency,
      status: "PENDING",
      provider: "STRIPE",
      providerPaymentId: providerId,
      description: `Registration for ${event.name}`,
      type: "EVENT_REGISTRATION",
      userId: user.id,
      eventId: event.id,
      registrationId: registration.id,
    }
  });

  console.log("Created PENDING Payment:", payment.id);

  // Now simulate the webhook processing
  const sessionCompletedEvent = {
    id: "evt_test123",
    type: "checkout.session.completed",
    data: {
      object: {
        id: providerId,
        metadata: {
          organizationId: event.organizationId,
          type: "event_registration",
          registrationId: registration.id
        }
      }
    }
  };

  console.log("Simulating Stripe Webhook: checkout.session.completed...");
  
  // Call the internal service method directly to bypass webhook signature validation
  await PaymentsService.processCheckoutSessionCompleted(sessionCompletedEvent.data.object as any);

  // Verify DB state
  const updatedPayment = await prisma.payment.findUnique({ where: { id: payment.id } });
  const updatedRegistration = await prisma.registration.findUnique({ where: { id: registration.id } });

  console.log("Verified Payment Status:", updatedPayment?.status);
  console.log("Verified Registration Status:", updatedRegistration?.status);
}

main().catch(console.error).finally(() => prisma.$disconnect());
