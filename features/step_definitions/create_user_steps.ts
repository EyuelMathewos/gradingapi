import supertest from "supertest";
import { assertThat } from 'hamjest';
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: any, response: any, statusValues: any, successMessage: any;



Given('account information with id {int} email  {string} firstName {string} lastName {string} password {string} social {string} role {int}', function (id:number,email:string, firstName:string, lastName:string, password:string, social:string, role:number) {
  data = {
    id,
    email, 
    firstName, 
    lastName, 
    password, 
    social, 
    role
  };
  return data;
});

When('registers for a new account', async function () {
 
    response = await request.post("/users").send(data);
    statusValues = response.status;
    successMessage = response.body.message
  
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