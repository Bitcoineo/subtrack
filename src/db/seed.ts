import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("Seeding test admin user...");
  await db
    .insert(schema.users)
    .values({
      id: "seed-admin-001",
      name: "Admin User",
      email: "admin@subtrack.dev",
      password: hashedPassword,
      plan: "free",
    })
    .onConflictDoNothing();

  console.log("Seeded: admin@subtrack.dev / password123");

  client.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
