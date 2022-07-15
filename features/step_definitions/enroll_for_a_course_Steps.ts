import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );
let user:any, data:any, id:number, role: number, response:any, error:any, bearerToken: object;
let statusValues:number;

Before(async function () {
        const loginRes = await request.post("/users/login").send({
        email: "student@gmail.com",
        password: "123456"
    });
    bearerToken = loginRes.body.token
})

Given('student account sign with account {int} and with role {int}', function (userId, roldId) {
    id = userId;
    role = roldId;
});

When('student enroll for a course {int}', async function (courseId) {
     data = {
                userId : id,
                courseId: courseId,
                role
            };
    response = await request.post(`/users/${id}/courses`)
    .set('Authorization', `Bearer ${bearerToken}` )
    .send(data);
  });

  Then('should get response from enroll courses with status code {int} and with message {string}', function (expectedCode, expectedMessage) {
        const code = response.status;
        const message = response.body.message
        assertThat(code, expectedCode );
        assertThat(message, expectedMessage );
        assertThat(typeof(data.userId), 'number');
        assertThat(typeof(data.courseId), 'number');
        assertThat(typeof(data.role), 'number');
    });