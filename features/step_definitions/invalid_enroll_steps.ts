import { Given, When, Then, Before } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );
let bearerToken:string, user:any, userId:number, role:number, response:any, error:any ;
Before(async function () {
    const response = await request.post("/users/login").send({
    email: "student@gmail.com",
    password: "123456"
});
    bearerToken = response.body.token
})
Given('user information', function (dataTable) {
    user = dataTable.hashes();
    userId = parseInt(user[0].id);
    role = parseInt(user[0].role);
});

When('try to enroll with course does\'t exist with course id {int}', async function (courseId) {
  const  data = {
        userId,
        courseId: courseId,
        role
    };                        ///:userId/courses
response = await request.post(`/users/${userId}/courses`)
.set('Authorization', `Bearer ${bearerToken}` )
.send(data);
error = response.body;
console.log("invalid enroll")
console.log(response)


});

Then('the enrolling user should get a response field {string}  message {string}', function (field:string, errorMessage:string ) {
   const data:object =  { [field]:  [errorMessage] }
   //assertThat(error.errors, data)
  });