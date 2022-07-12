import supertest from "supertest";
import { assertThat, string } from 'hamjest';
import { has } from "lodash";
const { Given, When, Then } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);

let data: object,  response:any, errorMessage: any ;

Given('user information already siginup with Email {string} firstName {string} lastName {string} password {string} social {string} role {int}', 
   function (email:string, firstName:string, lastName:string, password:string, social:string, role:number) {
    data = {
        email, 
        firstName,
        lastName,
        password,
        social , 
        role
      };
})

  When('registers for a new account already created account', async function () {
        response = await request.post("/users").send(data);
        errorMessage = response.body;
  });

  Then('user should get {string}', function (expected:string) {
     assertThat(errorMessage.error , expected );
  });