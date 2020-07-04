import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import "./Assignment.css";

const renderAssignment = (assignmentList, onAssignmentDelete) => {
  return assignmentList.map((assignment, index) => {
    return (
      <tr key={index}>
        <td>{assignment.courseid}</td>
        <td>{assignment.title}</td>
        <td>{assignment.description}</td>
        <td>{assignment.duedate}</td>
        <td>
          {/* TODO */}
          <Link to={`/assignmentform/${assignment.id}`}>
            <Button variant="primary">Edit</Button>
          </Link>
        </td>
        <td>
          {/* TODO */}
          <Button
            variant="primary"
            onClick={() => {
              onCourseDelete(assignment.id);
            }}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  });
};

// Assignment Component
const Assignment = (props) => {
  console.log(`rendering assignments...`, props);
  return (
    <div>
      <h1>Assignment</h1>
      <div className="assignmentlistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Course Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {renderAssignment(props.assignmentList, props.onAssignmentDelete)}
          </tbody>
        </Table>
        <p>
          <Link to="/assignmentform/0">
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

Assignment.propTypes = {
  assignmentList: PropTypes.array.isRequired,
  onAssignmentDelete: PropTypes.func.isRequired, // TODO
};

export default Assignment;
