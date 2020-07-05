import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Assignment Component
const Assignment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.id);

  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  const renderAssignment = (assignmentList) => {
    return assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .map((assignment, index) => {
        return (
          <tr key={index}>
            <td>{assignment.id}</td>
            <td>{assignment.title}</td>
            <td>{assignment.description}</td>
            <td>{assignment.duedate}</td>
            <td>
              <Link to={`/assignmentform/${courseId}/${assignment.id}`}>
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onAssignmentDelete(assignment.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });
  };

  return (
    <div>
      <h1>Assignments: {renderCourse()}</h1>
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
          <Link to={`/assignmentform/${courseId}/0`}>
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

Assignment.propTypes = {
  assignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  onAssignmentDelete: PropTypes.func.isRequired,
};

export default Assignment;
