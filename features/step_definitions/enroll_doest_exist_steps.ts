import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );

let user:any, data:any, id:number, role: number, response:any, errorMessage:any, bearerToken: object;

Before(async function () {
    const response = await request.post("/users/login").send({
        email: "student@gmail.com",
        password: "123456"
    });
    bearerToken = response.body.token
})
Given('sign with student account', function (dataTable) {
    user = dataTable.hashes();
    id = parseInt(user[0].id);
    role = parseInt(user[0].role);
});

When('student enroll for course does\'t exist {int}', async function (courseId:number) {
    data = {
        userId : id,
        courseId: courseId,
        role
    };
    response = await request.post(`/users/${id}/courses`)
    .set('Authorization', `Bearer ${bearerToken}` )
    .send(data);
    errorMessage = response.body;
});


Then('should get response with message {string}', function (expected) {
  
    assertThat(errorMessage.error, expected)
});