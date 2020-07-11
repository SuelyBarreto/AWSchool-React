import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Student Assignment Component
const StudentAssignment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  const enrolledInCourse = (studentId) => {
    const enrolled = props.enrollmentList.find(
      (enrollment) =>
        enrollment.courseid === courseId && enrollment.studentid === studentId
    );
    return enrolled;
  };

  // get studentId from currentUser, check if enrolled
  const studentId = props.currentUser
    ? props.currentUser.isstudent
      ? enrolledInCourse(props.currentUser.id)
        ? props.currentUser.id
        : 0
      : 0
    : 0;

  // return course id and title
  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  const getAnswer = (assignmentId) => {
    let answer = props.answerList.find(
      (answer) =>
        answer.assignmentid === assignmentId && answer.studentid === studentId
    );
    console.log(`Debug answer list`, props.answerList, answer);
    if (!answer) {
      answer = {
        answer: "",
        dateanswered: "",
        grade: "",
        dategraded: "",
      };
    }
    return answer;
  };

  // render assignment
  const renderAssignment = () => {
    let allAssignments = [];
    props.assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .forEach((assignment) => {
        const answer = getAnswer(assignment.id);
        allAssignments.push(
          <tr key={assignment.id}>
            <td>{assignment.id}</td>
            <td>{assignment.title}</td>
            <td>{assignment.description}</td>
            <td>{assignment.duedate}</td>
            <td>{answer.answer}</td>
            <td>{answer.dateanswered}</td>
            <td>{answer.grade}</td>
            <td>{answer.dategraded}</td>
            <td>
              <Link to={`/studentanswer/${courseId}/${assignment.id}`}>
                <Button variant="primary">Answer</Button>
              </Link>
            </td>
          </tr>
        );
      });
    return allAssignments;
  };

  // check if current user is student
  if (studentId === 0) {
    return <h3>Requires studentid Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Assignments: Course {renderCourse()}</h1>
        <div className="assignmentlistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Answer</th>
                <th>Date Answered</th>
                <th>Grade</th>
                <th>Date Graded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderAssignment()}</tbody>
          </Table>
          <p>
            <Link to={`/studentcourse`}>
              <Button variant="primary">Course List</Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
StudentAssignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
};

export default StudentAssignment;
