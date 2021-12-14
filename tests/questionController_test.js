import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
import { app } from "../app.js";

Deno.test({
  name: "Get to /quiz should redirect",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/quiz")
      .expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Get to /questions/22/delete hould redirect",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/questions/22/delete")
      .expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
