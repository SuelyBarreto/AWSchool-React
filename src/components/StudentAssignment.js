import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
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
    const course = props.courseList.find((course) => course.id === courseId);
    return course ? `${course.id} - ${course.title}` : `${courseId} - N/A`;
  };

  const getAnswer = (assignmentId) => {
    let answer = props.answerList.find(
      (answer) =>
        answer.assignmentid === assignmentId && answer.studentid === studentId
    );
    if (!answer) {
      answer = {
        id: 0,
        answer: "",
        dateanswered: "",
        grade: "",
        dategraded: "",
      };
    }
    return answer;
  };

  // shows sort button with the right icon
  const renderSortButton = (column) => {
    const iconType = column === props.assignmentSort ? "sort1" : "sort2";
    return (
      <span
        onClick={() => {
          props.setAssignmentSort(column);
        }}
      >
        <Icon iconType={iconType} />
      </span>
    );
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
            <td>{answer.dategraded ? answer.grade : ""}</td>
            <td>{answer.dategraded}</td>
            <td>
              <Link
                to={`/studentanswerform/${courseId}/${assignment.id}/${answer.id}`}
              >
                <Button variant="primary">
                  <Icon iconType="answer" />
                </Button>
              </Link>
            </td>
          </tr>
        );
      });
    return allAssignments;
  };

  // check if current user is student
  if (studentId === 0) {
    return <h3>Requires Student Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Assignments: Course {renderCourse()}</h1>
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>
                  Id &nbsp;
                  {renderSortButton("id")}
                </th>
                <th>
                  Title &nbsp;
                  {renderSortButton("title")}
                </th>
                <th>
                  Description &nbsp;
                  {renderSortButton("description")}
                </th>
                <th>
                  Due Date &nbsp;
                  {renderSortButton("duedate")}
                </th>
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
StudentAssignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  assignmentSort: PropTypes.string.isRequired,
  setAssignmentSort: PropTypes.func.isRequired,
};

export default StudentAssignment;
