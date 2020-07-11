import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Answer Component
const Answer = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);

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

  // return assignment id and title
  const renderAssignment = () => {
    let assignmentTitle = `${assignmentId} - N/A`;
    props.assignmentList.forEach((assignment) => {
      if (assignment.id === assignmentId) {
        assignmentTitle = `${assignment.id} - ${assignment.title}`;
      }
    });
    return assignmentTitle;
  };

  // return student id and name
  const renderStudent = (studentid) => {
    let studentName = `${studentid} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === studentid) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
  };

  // render answer
  const renderAnswer = (answerList) => {
    return answerList
      .filter((answer) => answer.assignmentid === assignmentId)
      .map((answer) => {
        return (
          <tr key={answer.id}>
            <td>{answer.id}</td>
            <td>{renderStudent(answer.studentid)}</td>
            <td>{answer.answer}</td>
            <td>{answer.dateanswered}</td>
            <td>{answer.grade}</td>
            <td>{answer.dategraded}</td>
            <td>
              <Link to={`/answerform/${courseId}/${assignmentId}/${answer.id}`}>
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  if (window.confirm("Confirm delete?")) {
                    props.onAnswerDelete(answer.id);
                  }
                }}
              >
                Delete
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
        <h1>
          Answers: Assignment {renderAssignment()} (Course {renderCourse()})
        </h1>
        <div className="answerlistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Student</th>
                <th>Answer</th>
                <th>Date Answered</th>
                <th>Grade</th>
                <th>Date Graded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderAnswer(props.answerList)}</tbody>
          </Table>
          <p>
            <Link to={`/answerform/${courseId}/${assignmentId}/0`}>
              <Button variant="primary">Add New</Button>
            </Link>
            &nbsp;
            <Link to={`/assignment/${courseId}`}>
              <Button variant="primary">Assignment List</Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
Answer.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  onAnswerDelete: PropTypes.func.isRequired,
};

export default Answer;
