import supertest from "supertest";
import { assertThat } from 'hamjest';
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: any, response: any, statusValues: any, successMessage: any;

Before(async function () {
  const loginRes = await request.post("/users/login").send({
    email: "admin@casl.io",
    password: "123456"
  });
  const bearerToken = loginRes.body.token;
  const userDel = await request.del("/users")
    .send({
      email: "student@gmail.com"
    })
    .set('Authorization', `Bearer ${bearerToken}`);
})

Given('account information', function (dataTable: any) {
  data = dataTable.hashes();
  return data;
});

When('registers for a new account', async function () {
  for (const key in data) {
    const userData = data[key];
    response = await request.post("/users").send(userData);
    statusValues = response.status;
    successMessage = response.body.message
  }
});

Then('after registering a user should get a response with status code {int} with message {string}', function (statusCode: number, expectedMessage: string) {
  const user = response.body.data
  assertThat(statusValues, statusCode);
  assertThat(successMessage, expectedMessage);
  assertThat(typeof (user.firstName), 'string')
  assertThat(typeof (user.lastName), 'string')
  assertThat(typeof (user.email), 'string')
  assertThat(typeof (user.password), 'string')
  assertThat(typeof (user.role), 'number')
});