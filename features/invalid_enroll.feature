@enrol
Feature: Enrolling for a course
  Scenario: student enrolling for a course does't exist
    Given user information
        |    id    |        email      |firstName | role  |
        |     1    |    test@gmail.com |   test   |   1   |
    When  try to enroll with course does't exist with course id <id>
    Then  the enrolling user should get a response field "<error>"  message "<errorOcc>"
    Examples:
       |    id    |   name  |  courseDetails  |  error   |          errorOcc                          |
       |   'st'   |     12  |    12           | courseId | The courseId must be a number.             |

