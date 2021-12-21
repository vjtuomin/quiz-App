import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
import { assertMatch } from "https://deno.land/std@0.113.0/testing/asserts.ts";

import { app } from "../app.js";

Deno.test({
  name: "GET request to / should return 200",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
Deno.test({
  name: "Get to /api/questions/random should return a json document",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST to /api/questions/answer should return a json document",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer")
      .send({ questionId: 55, optionId: 79 })
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST to /api/questions/answer should return a correct",
  async fn() {
    const testClient = await superoak(app);
    const response = await testClient.post("/api/questions/answer")
      .send({ questionId: 55, optionId: 84 })
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
    const value = response.body;
    assertMatch(value.correct, new RegExp("true"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "POST to /api/questions/answer should return a false",
  async fn() {
    const testClient = await superoak(app);
    const response = await testClient.post("/api/questions/answer")
      .send({ questionId: 55, optionId: 85 })
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
    const value = response.body;
    assertMatch(value.correct, new RegExp("false"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
