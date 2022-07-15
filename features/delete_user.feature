@user @userdelete
Feature: deleting user account
  Scenario: successfully delete user data
    Given user siginup information
    When  delete a current account id <id>
    Then  after deleteing a user data should get a response with status code 200 with message 'user deleted successfully'

    Examples:
   |   id   |        email            | firstName  |  lastName|   password   |  social    |   role   |
   |  134   | studentdelete@gmail.com |   student  |  update  |   123456     |     []     |     1    |