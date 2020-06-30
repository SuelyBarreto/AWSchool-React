import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import "./Assignment.css";

const renderAssignment = (assignmentList) => {
  return assignmentList.map((assignment, index) => {
    return (
      <tr key={index}>
        <td>{assignment.courseid}</td>
        <td>{assignment.title}</td>
        <td>{assignment.description}</td>
        <td>{assignment.duedate}</td>
        <td>
          <Button variant="primary">Edit</Button>
        </td>
        <td>
          <Button variant="primary">Delete</Button>
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
              <td>Course Id</td>
              <td>Title</td>
              <td>Description</td>
              <td>Due Date</td>
              <td>Select</td>
            </tr>
          </thead>
          <tbody>{renderAssignment(props.assignmentList)}</tbody>
        </Table>
        <p>
          <Button variant="primary">Add Assignment</Button>
        </p>
      </div>
    </div>
  );
};

Assignment.propTypes = {
  assignmentList: PropTypes.array.isRequired,
};

export default Assignment;
