import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";

async function run() {
  require("dotenv").config({ path: "server/.env" });
  console.log("GEMINI_API_KEY configured:", !!process.env.GEMINI_API_KEY);

  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    include: { memberships: { include: { organization: true, role: true } } }
  });

  if (!user || user.memberships.length === 0) {
    console.error("No user found with memberships.");
    return;
  }
  
  const org = user.memberships[0].organization;
  console.log(`Using user: ${user.email} and org: ${org.id}`);

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "replace-with-secure-secret", { expiresIn: "1h" });

  try {
    const res = await fetch("http://localhost:3000/api/v1/ai-copilot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-organization-id": org.id
      },
      body: JSON.stringify({ message: "Give me a short summary of the platform's purpose." })
    });

    const data = await res.json();
    console.log("Response Status:", res.status);
    console.log("Response Data:", JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
  }
}

run().catch(console.error);
