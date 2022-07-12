# @user
Feature: user signup for new account
  Scenario: successfully create user
    Given account information 
          |        email      | firstName  |  lastName|   password   |  social    |   role   |
          | student@gmail.com |   student  |   test2  |   123456     |     []     |     2    |

    When  registers for a new account
    Then  user should get a response with status code 200