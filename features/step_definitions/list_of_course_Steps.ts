import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );
let response : any, id: number, bearerToken: string;

Before(async function () {
    const response = await request.post("/users/login").send({
    email: "student@gmail.com",
    password: "123456"
});
    bearerToken = response.body.token
})
Given('student account with id of {int}', function (userId) {
    id = userId;
});

When('student want all of course enrolled', async function () {
    response = await request.get(`/users/${id}/courses`)
    .set('Authorization', `Bearer ${bearerToken}`);
});

Then('should get a response with status code {int} with message {string}', function (statusCode: number, expectedMessage) {
    const code = response.status;
    const message = response.body.message
    assertThat( code, statusCode);
    assertThat( message, expectedMessage);
});