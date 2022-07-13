@user
Feature: user signup for new account
  Scenario: successfully create user
    Given account information 
          |        email      | firstName  |  lastName|   password   |  social    |   role   |
          | student@gmail.com |   student  |   test2  |   123456     |     []     |     1    |

    When  registers for a new account
    Then  after registering a user should get a response with status code 201 with message 'user created successfully'