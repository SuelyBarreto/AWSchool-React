# AWSchool

## Description

Website where teachers can assign homework to their students.
Students can view their assigned homework.
This is useful for schools using remote learning due to Covid.

## Example Features

- As a School Administrator, I can add teachers, students, and classes.
- As a School Administrator, I can assign teachers and students to classes
- As a Teacher, I can see my classes.
- As a Teacher, I can assign homework to a class.
- As a Student, I can see my classes.
- As a Student, I can see homework assigned to me.

## Learning Goals

- Demonstrate self-direction, time management, and independent learning
- Learn and implement new technologies
- Complete a product lifecycle from conception to delivery
- Utilize agile practices learned to assist in project completion

## Problem Statement

Teachers and students are working online more than ever. Coordinating homework assignments can be difficult. This project aims to offer a simple solution so teachers can share assignments and students can provide their answers, all using an easy website.

## Project Information

### Overview and Technology Stack

- Design Considerations
- Front-End Requirements
  \*\* React Front-End
- Back-End Requirements
  ** AWS API Gateway
  ** AWS Lambda Functions
  \*\* AWS DynamoDB

### Steps to Create Solution

- Create AWS DynamoDB tables
- Create AWS Lambda (serverless) functions to access AWS DynamoDB tables
- Create AWS API Gateway routes to AWS Lambda functions
- Build UI using a NodeJS React application
- Integrate REST API with React application
- Deploy application on an AWS EC2 instance

## Project Waves

### Wave 1

- Create tables in DynamoDB

\*\* Person
\*\* Course
\*\* CourseStudent
\*\* Assignment
\*\* AssignmentStudent

- Create role with permission for table access in IAM

\*\* Permission for Lambda functions to access DynamoDB

### Wave 2

- Create Lambda functions

\*\* List Person
\*\* Add/Edit Person
\*\* Delete Person
\*\* List Courses
\*\* Add/Edit Course
\*\* Delete Course
\*\* Add Student to Course
\*\* Delete Student from Course
\*\* List Assignments
\*\* Add/Edit Assignment
\*\* Delete Assignment
\*\* List Assignment Student
\*\* Add/Edit Assignment Student

### Wave 3

- Create React applications

\*\* Login
\*\* Landing Page
\*\* Admin: Person (list, add, edit, delete)
\*\* Admin: Courses (list, add, edit, delete)
\*\* Admin: Students by Course (list, add, delete)
\*\* Teacher: Courses (list)
\*\* Teacher: Students by Course (list)
\*\* Teacher: Assignments by Course (list, add, edit, delete)
\*\* Teacher: Assignment Answers by Assignment (list, grade)
\*\* Students: Courses (list)
\*\* Students: Assignments by Course (list, answer)

### Wave 4

\*\* CSS
\*\* OAuth

### Wave 5

React Deployment

## Notes

- API Gateway Bug

Model failure shows error about CORS.
I was getting an error saying the API call was blocked because of CORS, but it turns out it was a failure of my post request body to match the model defined in the API Gateway ( I was passing an empty string and it expected a Boolean). I spent a day debugging CORS and the problem was in my request body.
