import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";
import auth from "../../../../config/auth";

let connection: Connection;

describe("Show user profile", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: 'user@hotmail.com.br',
      password: '1234'
    });

    auth.jwt.secret = "1554";

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: 'user@hotmail.com.br',
      password: '1234'
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  })

  it("should not be able to show a user profile a incorrect token", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer 9989654974`,
    });

    expect(response.status).toBe(401);
  })

})