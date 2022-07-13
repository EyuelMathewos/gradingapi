@important
Feature: Enrolling for a course
  Scenario: student enrolling for a course 
    Given sign with student account
        |    id    |        email      |   password  | firstName | role  |
        |    10    | student@gmail.com |   123456    |  test     |   1   |
    When student enroll for course does't exist <courseId>
    Then should get response with message "CourseEnrollment_fields: (`userId`,`courseId`)"

    Examples: 
            |          course            |   courseId   |   
            |    Data structure          |      104     |