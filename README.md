# AWSchool - Capstone Project

## Learning Goals

- Demonstrate self-direction, time management, and independent learning
- Learn and implement new technologies
- Gain experience with React and learn AWS technologies (S3, Cognito, API Gateway, Lambda and DynamoDB)
- Complete a product lifecycle from conception to delivery
- Utilize agile practices learned to assist in project completion

## Description

Create a website where teachers can assign homework to their students.
Students can view their assigned homework.
This is useful for schools using remote learning due to Covid - 19.

## Example Features

### As a User, I can

- Login
- Logout

### As a School Administrator, I can

- View/add/edit/delete teachers
- View/add/edit/delete students
- View/add/edit/delete courses
- Assign teachers to courses
- Assign students to courses

### As a Teacher, I can

- View my courses
- View/add/edit/delete assignments
- View/grade answers

### As a Student, I can

- View my courses
- View assignments
- View/add/edit/delete answers

## Problem Statement

Teachers and students are working online more than ever. Coordinating homework assignments can be difficult. This project aims to offer a simple solution so teachers can share assignments and students can provide their answers, all using an easy website.

## Project Information

### Technology Stack

- Front-End
  - NodeJS
  - React
  - AWS Cognito
- Back-End
  - AWS API Gateway
  - AWS Lambda Functions
  - AWS DynamoDB

### Steps to Create Solution

- Create AWS DynamoDB tables
- Create AWS Lambda (serverless) functions to access AWS DynamoDB tables
- Create AWS API Gateway routes to AWS Lambda functions
- Build UI using a NodeJS React application
- Integrate REST API with React application
- Deploy application on S3

## Validations

### Person

- Email – a person must have a unique, string type email.
- ID – a person must have a unique, numeric ID that is not zero.
- A person must be an “administrator”, a “teacher” or a “student”. Person cannot be a teacher and a student at the same course.
- Password – a person must have a password that is a string, has at least 8 characters, one lower case, one up case, one number and one special character. For front end, person must type password twice and they must match.
- A person must have a name that is a string.

### Course

- Description – a course must have a description, which is a string.
- Start Date – a course must have a start date, which is a string.
- End Date – a course must have an end date, which is also a string. End date must be bigger or equal to start date.
- ID – a course must have a unique numeric ID.
- Teacher ID – a course must have a teacher ID, which is numeric.
- Title – a course must have its own title, which is a string.
- Login – only a teacher for that course can access its content.

### CourseStudent

- ID – a course student or enrollment must have an ID which is numeric.
- Course ID – a course student must have a numeric course ID.
- Average Grade – a course student must have a numeric average grade, which is float.
- Student Id – a course the student must have a student ID which is numeric and unique.

### Assignment

- ID – an assignment must have an ID which is numeric.
- Course ID – an assignment must have the course ID which is numeric.
- Description – an assignment must have a description which is a string.
- Due Date – an assignment must have a due date which is a string.
- Title – an assignment must have a title which is a string.

### AssignmentStudent

- ID – an assignment student or answer must have an ID which is numeric.
- Answer ID – an assignment student or answer must have a numeric answer ID.
- Answer – an assignment student must have an answer which is a string and can be empty.
- Date Answered – an assignment student must have a date answered which is a string.
- Date Graded – an assignment student must have a date graded which is a string and must be bigger or equal to the date answered.
- Grade - an assignment student or answer must have a grade which is a numeric float.

## Project Waves

### Wave 1

- Create tables in DynamoDB

  - Person
  - Course
  - Enrollment
  - Assignment
  - AssignmentStudent

- Create role with permission for table access in IAM

  - Permission for Lambda functions to access DynamoDB

### Wave 2

- Create Lambda functions

  - List Person
  - Add/Edit Person
  - Delete Person
  - List Courses
  - Add/Edit Course
  - Delete Course
  - Add Student to Course
  - Delete Student from Course
  - List Assignments
  - Add/Edit Assignment
  - Delete Assignment
  - List Assignment Student
  - Add/Edit Assignment Student

### Wave 3

- Create React applications

  - Login/Logout
  - Landing Page
  - Admin: Person (list, add, edit, delete)
  - Admin: Courses (list, add, edit, delete)
  - Admin: Students by Course (list, add, delete)
  - Teacher: Courses (list)
  - Teacher: Students by Course (list)
  - Teacher: Assignments by Course (list, add, edit, delete)
  - Teacher: Assignment Answers by Assignment (list, grade)
  - Students: Courses (list)
  - Students: Assignments by Course (list, answer)

### Wave 4

- React Deployment on S3
- Add validations for Front and Back End
- OAuth with AWS Cognito
- CSS

## Notes

- API Gateway Bug

Model failure shows error about CORS.
I was getting an error saying the API call was blocked because of CORS, but it turns out it was a failure of my post request body to match the model defined in the API Gateway ( I was passing an empty string and it expected a Boolean). I spent a day debugging CORS and the problem was in my request body.
