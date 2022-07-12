import supertest from "supertest";
import { assertThat, string } from 'hamjest';
const { Given, When, Then } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data:any, response:any, statusValues:any ;
  Given('account information', function (dataTable: any) {
    data = dataTable.hashes();
    return data;
  });

  When('registers for a new account', async function () {
    for (const key in data) {
        const userData = data[key];
        response = await request.post("/users").send(userData);
        statusValues = response.status;
      }
  });

  Then('user should get a response with status code {int}', function (statusCode: any) {
       const user = response.body 
       assertThat(statusValues, statusCode);
       assertThat(typeof(user.firstName), 'string')
       assertThat(typeof(user.lastName), 'string')
       assertThat(typeof(user.email), 'string')
       assertThat(typeof(user.password), 'string')
       assertThat(typeof(user.role), 'number')
  });

