Feature: checking course enrollment list
  Scenario: student seeing list of enroll courses
    Given student account
          |    id    |        email      |firstName | 
          |     1    |    test@gmail.com |   test   |
    When student want all of course enrolled
    Then should get a response with status code 200