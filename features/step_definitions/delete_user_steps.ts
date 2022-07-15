import supertest from "supertest";
import { assertThat } from 'hamjest';
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: any, response: any, statusValues: any, successMessage: any, bearerToken: any;

Before(async function () {
  const loginRes = await request.post("/users/login").send({
    email: "studentdelete@gmail.com",
    password: "123456"
  });
  bearerToken = loginRes.body.token;
})

Given('user siginup information', function () {
  bearerToken
});


When('delete a current account id {int}', async function (id:number) {
    response = await request.delete(`/users/${id}`)
    .set('Authorization', `Bearer ${bearerToken}`);
    successMessage = response.body.message;
    statusValues = response.status;
});

Then('after deleteing a user data should get a response with status code {int} with message {string}', function (statusCode:number, expectedMessage:string) {
    assertThat(statusValues, statusCode);
    assertThat(successMessage, expectedMessage);
});