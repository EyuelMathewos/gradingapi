import supertest from "supertest";
import { assertThat, string } from 'hamjest';
const { Given, When, Then } = require('@cucumber/cucumber');
const userapi = require("../../app");
const request = supertest(userapi);
let data: object,  response:any, error: any ;


    Given('invalid user email {string} firstName {string} lastName {string} password {string} social {string} role {int}', 
       function (email: string, firstName: string, lastName: string, password: string, social: string, role:number) {
       data = {
         email, 
         firstName,
         lastName,
         password,
         social , 
         role
       };
    });
    
    When('try to register with invalid data', async function () {
            response = await request.post("/users").send(data);
            error = response.body;
    });

    Then('user should get a response field {string}  message {string}', function (field:string, errorMessage:string) {
        const data:object =  { [field]:  [errorMessage] }
        assertThat(error.errors, data)
      });





