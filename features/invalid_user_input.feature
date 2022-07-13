@important
Feature: user signup for new account
  Scenario: user Enter invalid user data
    Given invalid user email "<email>" firstName "<firstName>" lastName "<lastName>" password "<password>" social "<social>" role <role>
    When  try to register with invalid data
    Then  user should get a response field "<error>"  message "<errorOcc>"

Examples:
    |        email      | firstName  |  lastName|   password   |  social    |   role   |    error   |          errorOcc                          |
    | student           |   student  |   test2  |   123456     |     []     |     2    |  email     | The email format is invalid.               |
    |                   |   student  |   test2  |   123456     |     []     |     2    |  email     | The email field is required.               |    
    | student@gmail.com |            |   test2  |   123456     |     []     |     2    |  firstName | The firstName field is required.           |
    | student@gmail.com |   student  |          |   123456     |     []     |     2    |  lastName  | The lastName field is required.            |    
    | student@gmail.com |   student  |   test2  |              |     []     |     2    |  password  | The password field is required.            |  
    | student@gmail.com |   student  |   test2  |    123       |     []     |     2    |  password  | The password must be at least 6 characters.|  