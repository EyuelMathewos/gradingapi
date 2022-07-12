import { Given, When, Then } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );

let  user:any, id:number, courseId:number, course:any , droping_Course: any, response:any;

Given('student siginup with this account info', function (dataTable) {
    user = dataTable.hashes();
    id = user[0].id;
});

When('student drop for course <courseId>', async function (dataTable) {
    course = dataTable.hashes();
    courseId = course[0].courseId;
    droping_Course = await request.delete(`/users/${id}/courses/${courseId}`);
});

Then('droping course should get response of {int}', function (statusCode) {
    assertThat(droping_Course.status, statusCode )
});