import { Given, When, Then } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );

let  user:any, id:number, response:any, successMessage:any;

Given('student siginup with this account info', function (dataTable) {
    user = dataTable.hashes();
    id = user[0].id;
});

When('student drop for course {int}', async function (courseId) {
    response = await request.delete(`/users/${id}/courses/${courseId}`);
    console.log("response data");
    console.log(response.body)
    successMessage = response.body.message;
});

Then('droping course should get response of code {int} with message {string}', function (statusCode, expectedMessage) {
    assertThat(response.status, statusCode )
    assertThat(successMessage, expectedMessage )
});