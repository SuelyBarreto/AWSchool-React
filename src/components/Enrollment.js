import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Enrollment Component
const Enrollment = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

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
            <td>
              <Button
                variant="primary"
                onClick={() => {
                  if (window.confirm("Confirm delete?")) {
                    props.onEnrollmentDelete(enrollment.id);
                  }
                }}
              >
                <Icon iconType="delete" />
              </Button>
            </td>
          </tr>
        );
      });
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Enrollment: Course {renderCourse()}</h1>
        <div className="enrollmentlistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Student Id</th>
                <th>Assignments Graded</th>
                <th>Average Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/enrollmentform/${courseId}/0`}>
              <Button variant="primary">
                <Icon iconType="add" /> Add New
              </Button>
            </Link>
            &nbsp;
            <Link to={`/course`}>
              <Button variant="primary">
                <Icon iconType="back" /> Course List
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
  onEnrollmentDelete: PropTypes.func.isRequired,
};

export default Enrollment;
