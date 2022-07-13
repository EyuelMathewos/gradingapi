Feature: Enrolling for a course
  Scenario: student enrolling for a course 
    Given student account sign with account
        |    id    |        email      |firstName | role  |
        |     1    |    test@gmail.com |   test   |   1   |
    When student enroll for a course <courseId>

    Then should get response from enroll courses with status code 200

    Examples: 
            |          course            |   courseId   |   
            |Database and administartion |      2       |