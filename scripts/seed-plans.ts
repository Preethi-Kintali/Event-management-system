import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'Starter',
        description: 'For small events',
        price: 29.00,
        stripeProductId: 'prod_starter',
        stripePriceId: 'price_starter',
        features: ["Up to 100 participants", "Basic Analytics", "Email Support"]
      },
      {
        name: 'Professional',
        description: 'For growing organizations',
        price: 99.00,
        stripeProductId: 'prod_pro',
        stripePriceId: 'price_pro',
        features: ["Up to 1000 participants", "Advanced Analytics", "Priority Support"]
      },
      {
        name: 'Enterprise',
        description: 'For large scale events',
        price: 299.00,
        stripeProductId: 'prod_ent',
        stripePriceId: 'price_ent',
        features: ["Unlimited participants", "Custom Reporting", "24/7 Phone Support"]
      }
    ],
    skipDuplicates: true
  });
  console.log('Seeded Subscription Plans');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
