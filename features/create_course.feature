# @course
# Feature: user account
#   Scenario: successfully create user
#     Given user sign up with course manager account email "<email>" and password of "<password>" 
#     When  course created with course name "<name>" course Details "<courseDetails>"
#     Then  after course a user should get a response with status code 201 with message 'Course created successfully'

#     Examples:  
#           |        email      | firstName  |  lastName|   password   |  social    |   role   |
#           | coursemanag@gm.com| coursemanag|   course |   123456     |     []     |     4    |

#     Examples:  
#           |        name          | courseDetails      |
#           | introduction to Java | programming lang   |

