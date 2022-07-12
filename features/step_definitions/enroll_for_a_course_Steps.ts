import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );
let user:any, data:any, id:number, role: number, response:any, error:any, bearerToken: object;
let statusValues:number;

Before(async function () {
        const response = await request.post("/users/login").send({
        email: "student@gmail.com",
        password: "123456"
    });
    bearerToken = response.body.token
})

Given('student account sign with account', function (dataTable) {
    user = dataTable.hashes();
    id = parseInt(user[0].id);
    role = parseInt(user[0].role);
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

  Then('should get response from enroll courses with status code {int}', function ( statusCode ) {
        assertThat(response.status, statusCode );
        assertThat(typeof(data.userId), 'number');
        assertThat(typeof(data.courseId), 'number');
        assertThat(typeof(data.role), 'number');
    });