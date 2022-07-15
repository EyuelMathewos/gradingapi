import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );

let  user:any, id:number, response:any, successMessage:any, bearerToken: any;
Before(async function () {
  const loginRes = await request.post("/users/login").send({
    email: "student@gmail.com",
    password: "123456"
  });
  bearerToken = loginRes.body.token;
})
Given('student siginup with this account info', function (dataTable) {
    user = dataTable.hashes();
    id = user[0].id;
});

When('student drop for course {int}', async function (courseId) {
    response = await request.delete(`/users/${id}/courses/${courseId}`)
    .set('Authorization', `Bearer ${bearerToken}` );
    successMessage = response.body.message;
});

Then('droping course should get response of code {int} with message {string}', function (statusCode, expectedMessage) {
    assertThat(response.status, statusCode )
    assertThat(successMessage, expectedMessage )
});