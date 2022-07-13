Feature: Dropping a course
  Scenario: student Dropping a course enrolled for 
    Given student siginup with this account info
          |    id    |        email      |firstName | 
          |     1    |    test@gmail.com |   test   |
    When student drop for course <courseId>
    Then droping course should get response of code 200 with message "Course Droped successfully"
    
    Examples:
            |          course           |  courseDetails      |   courseId   |   
            |  introduction to nc       |  course discription |       3      |