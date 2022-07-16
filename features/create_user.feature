@user @usercreate
Feature: creating user account
  Scenario: successfully create user
    Given account information with id <id> email  "<email>" firstName "<firstName>" lastName "<lastName>" password "<password>" social "<social>" role <role>
    When  registers for a new account
    Then  after registering a user should get a response with status code 201 with message 'user created successfully'
Examples:
    |  id  |        email            |     firstName    |  lastName   |   password      |  social    |   role   |
    |   8  |   newaccount@gmail.com  |    newaccount    |   acc       |   123456        |     []     |     1    |