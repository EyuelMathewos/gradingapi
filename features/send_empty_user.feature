@user @important
Feature: creating user account
  Scenario: user siginup with no information
    Given undefined user information
    When  try to create user account with undefined data
    Then  user should get status code 412