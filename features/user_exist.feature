@important
Feature: user signup for new account
  Scenario: user already siginup for account
    Given user information already siginup with Email "<email>" firstName "<firstName>" lastName "<lastName>" password "<password>" social "<social>" role <role>
    When  registers for a new account already created account
    Then  user should get "There is a unique constraint violation, a new user cannot be created with this email"

    Examples:
          |        email      | firstName  |  lastName|   password     |  social    |   role   |
          | student@gmail.com |   student  |   test2  |   '123456'     |     []     |     2    |