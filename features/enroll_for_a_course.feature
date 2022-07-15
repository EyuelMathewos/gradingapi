@enrollcourse
Feature: Enrolling for a course
  Scenario: student enrolling for a course 
    Given student account sign with account <studentId> and with role <role>
    When student enroll for a course <courseId>

    Then should get response from enroll courses with status code 200 and with message 'student with id <studentId> successfully enrolled for a course'

    Examples: 
            |          course            |   courseId   |   studentId  |   role  |
            |Database and administartion |      3       |       1      |    1    |