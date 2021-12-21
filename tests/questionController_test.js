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
  name: "Get to /questions/22/delete should redirect",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/questions/22/delete")
      .expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Post to /questions/22/options should redirect",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/questions/22/options")
      .expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Post to /questions/50/options/79 should redirect",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/questions/50/options/79")
      .expect(302);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
