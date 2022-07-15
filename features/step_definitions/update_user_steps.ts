import supertest from "supertest";
import { assertThat } from 'hamjest';
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: any, response: any, statusValues: any, successMessage: any, bearerToken: any ;

Before(async function () {
  const response = await request.post("/users/login").send({
    email: "updatestudent@gmail.com",
    password: "123456"
  });
  bearerToken = response.body.token;
})


Given('current user information', function () {
   bearerToken
});
       
When('update a current account id {int} email {string} firstName {string} lastName {string} social {string}', async function (id:number, email:string, firstName:string, lastName:string, social:string) {
      response = await request.put(`/users/${id}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .send({
        email,
        firstName,
        lastName,
        social
      });
      statusValues = response.status;
      successMessage = response.body.message;
  });

Then('after updating a user data should get a response with status code {int} with message {string}', function (statusCode: number, expectedMessage: string) {
      assertThat(statusValues, statusCode);
      assertThat(successMessage, expectedMessage);
});