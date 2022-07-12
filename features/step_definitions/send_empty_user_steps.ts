import supertest from "supertest";
import { assertThat, string } from 'hamjest';
import { has } from "lodash";
const { Given, When, Then } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: object,  response:any, errorMessage: any, statusCode: number ;
Given('undefined user information', function () {
   data = {};
});

When('try to create user account with undefined data', async function () {
    response = await request.post("/users").send(data);
    statusCode = response.status; 
    errorMessage = response.body;
});

Then('user should get status code {int}', function (expected: number) {
    const default_error = {
        "errors": {
            "email": [
                "The email field is required."
            ],
            "firstName": [
                "The firstName field is required."
            ],
            "lastName": [
                "The lastName field is required."
            ],
            "password": [
                "The password field is required."
            ],
            "role": [
                "The role field is required."
            ]
        },
        "status": false
    }
    assertThat(statusCode , expected );
    assertThat(errorMessage , default_error );
});