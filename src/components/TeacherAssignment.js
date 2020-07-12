import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Teacher Assignment Component
const TeacherAssignment = (props) => {
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
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  // render assignment
  const renderAssignment = (assignmentList) => {
    return assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .map((assignment) => {
        return (
          <tr key={assignment.id}>
            <td>{assignment.id}</td>
            <td>{assignment.title}</td>
            <td>{assignment.description}</td>
            <td>{assignment.duedate}</td>
            <td>
              <Link to={`/teacheranswer/${courseId}/${assignment.id}`}>
                <Button variant="primary">
                  <Icon iconType="answer" />
                </Button>
              </Link>
              &nbsp;
              <Link to={`/teacherassignmentform/${courseId}/${assignment.id}`}>
                <Button variant="primary">
                  <Icon iconType="edit" />
                </Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  if (window.confirm("Confirm delete?")) {
                    props.onAssignmentDelete(assignment.id);
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

  // check if current user is teacher
  if (teacherId === 0) {
    return <h3>Requires Teacher Login</h3>;
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderAssignment(props.assignmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/teacherassignmentform/${courseId}/0`}>
              <Button variant="primary">
                <Icon iconType="add" />
                Add New
              </Button>
            </Link>
            &nbsp;
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
TeacherAssignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  onAssignmentDelete: PropTypes.func.isRequired,
};

export default TeacherAssignment;
