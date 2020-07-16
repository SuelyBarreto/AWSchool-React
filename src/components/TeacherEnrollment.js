import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Enrollment Component
const Enrollment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  // get teacherId from currentUser
  // check it is the teacher for the course
  const teacherId = props.currentUser
    ? props.currentUser.isteacher
      ? props.courseList.find(
          (course) =>
            course.teacherid === props.currentUser.id && course.id === courseId
        )
        ? props.currentUser.id
        : 0
      : 0
    : 0;

  // return course id and title
  const renderCourse = () => {
    const course = props.courseList.find((course) => course.id === courseId);
    return course ? `${course.id} - ${course.title}` : `${courseId} - N/A`;
  };

  // return student id and name
  const renderStudent = (studentid) => {
    const person = props.personList.find((person) => person.id === studentid);
    return person
      ? `${person.id} - ${person.personname}`
      : `${studentid} - N/A`;
  };

  // show average grade for student
  const getGrade = (studentId) => {
    let totalGrade = 0;
    let countGrade = 0;
    let countAssignment = 0;

    props.assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .forEach((assignment) => {
        countAssignment++;
        const studentAnswer = props.answerList.find(
          (answer) =>
            answer.assignmentid === assignment.id &&
            answer.studentid === studentId
        );
        if (studentAnswer) {
          if (studentAnswer.dategraded) {
            totalGrade += studentAnswer.grade;
            countGrade++;
          }
        }
      });

    // calculate average grade
    let averageGrade = 0;
    if (countGrade > 0) {
      averageGrade = totalGrade / countGrade;
    }
    return {
      assignments: countAssignment,
      graded: countGrade,
      average: averageGrade.toFixed(2),
    };
  };

  // render enrollment
  const renderEnrollment = (enrollmentList) => {
    return enrollmentList
      .filter((enrollment) => enrollment.courseid === courseId)
      .map((enrollment) => {
        const grade = getGrade(enrollment.studentid);
        return (
          <tr key={enrollment.id}>
            <td>{enrollment.id}</td>
            <td>{renderStudent(enrollment.studentid)}</td>
            <td>
              {grade.graded} of {grade.assignments}
            </td>
            <td>{grade.average}</td>
          </tr>
        );
      });
  };

  // check if current user is teacher
  if (teacherId === 0) {
    return <h3>Requires Teacher Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Enrollment: Course {renderCourse()}</h1>
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Student Id</th>
                <th>Assignments Graded</th>
                <th>Average Grade</th>
              </tr>
            </thead>
            <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/teachercourse`}>
              <Button variant="primary">
                <Icon iconType="back" />
                Course List
              </Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
Enrollment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
};

export default Enrollment;
