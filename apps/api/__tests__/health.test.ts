import request from "supertest";

import { createApp } from "../src/app";

const app = createApp();

describe("GET /api/health", () => {
  it("should return ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});


