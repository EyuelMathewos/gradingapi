Feature: Dropping a course
  Scenario: student Dropping a course enrolled for 
    Given student siginup with this account info
          |    id    |        email      |firstName | 
          |     1    |    test@gmail.com |   test   |
    When student drop for course <courseId>
            |          course           |  courseDetails      |   courseId   |   
            |  introduction to nc       |  course discription |     3        |
    Then droping course should get response of 200