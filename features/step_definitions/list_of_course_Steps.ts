import { Given, When, Then } from '@cucumber/cucumber';
import supertest from "supertest";
import { assertThat } from 'hamjest';
const userapi = require("../../app");
const request = supertest( userapi );
let user: Array<any>;
let response : {status : number, body: object};
Given('student account', function (dataTable: { hashes: () => any; }) {
    user = dataTable.hashes();
});

When('student want all of course enrolled', async function () {
    const id = user[0].id;
    response = await request.get(`/users/${id}/courses`);
});

Then('should get a response with status code {int}', function (int) {
    assertThat( response.status, int);
});