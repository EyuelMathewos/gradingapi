@userupdate
Feature: creating user account
  Scenario: successfully update user data
    Given current user information 
    When  update a current account id <id> email "<email>" firstName "<firstName>" lastName "<lastName>" social "<social>" 
    Then  after updating a user data should get a response with status code 201 with message 'user updated successfully'

    Examples:
   |   id   |        email            | firstName  |  lastName|   password   |  social    |   role   |
   |  9     | updatestudent@gmail.com |   student  |  update  |   123456     |     []     |     1    |