import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const { setupStripePlans } = await import("../lib/stripe");

  console.log("Creating Stripe products and prices...\n");

  const result = await setupStripePlans();

  if (result.error || !result.data) {
    console.error("Failed:", result.error);
    process.exit(1);
  }

  const { data } = result;

  console.log("Stripe setup complete!\n");
  console.log("Add these to your .env.local:\n");
  console.log(`STRIPE_PRO_MONTHLY_PRICE_ID=${data.proMonthlyPriceId}`);
  console.log(`STRIPE_PRO_YEARLY_PRICE_ID=${data.proYearlyPriceId}`);
  console.log(
    `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=${data.enterpriseMonthlyPriceId}`
  );
  console.log(
    `STRIPE_ENTERPRISE_YEARLY_PRICE_ID=${data.enterpriseYearlyPriceId}`
  );
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
