@listofcourse
Feature: checking course enrollment list
  Scenario: student seeing list of enroll courses
    Given student account with id of <id>
    When student want all of course enrolled
    Then should get a response with status code 200 with message 'List of course with a student Id: <id> Enrolled'

    Examples:
    |    id    |        email      |firstName | 
    |     1    |    test@gmail.com |   test   |