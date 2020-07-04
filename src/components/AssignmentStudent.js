import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./AssignmentStudent.css";

const renderAssignmentStudent = (assignmentStudentList) => {
  return assignmentStudentList.map((assignmentStudent, index) => {
    return (
      <tr key={index}>
        <td>{assignmentStudent.assignmentid}</td>
        <td>{assignmentStudent.studentid}</td>
        <td>{assignmentStudent.answer}</td>
        <td>{assignmentStudent.dateanswered}</td>
        <td>{assignmentStudent.grade}</td>
        <td>{assignmentStudent.dategraded}</td>
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

// AssignmentStudent Component
const AssignmentStudent = (props) => {
  console.log(`rendering assignmentStudents...`, props);
  return (
    <div>
      <h1>Student Assignment</h1>
      <div className="assignmentStudentlistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Assignment Id</th>
              <th>Student Id</th>
              <th>Answer</th>
              <th>Date Answered</th>
              <th>Grade</th>
              <th>Date Graded</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>{renderAssignmentStudent(props.assignmentStudentList)}</tbody>
        </Table>
        <p>
          <Button variant="primary">Add AssignmentStudent</Button>
        </p>
      </div>
    </div>
  );
};

AssignmentStudent.propTypes = {
  assignmentStudentList: PropTypes.array.isRequired,
};

export default AssignmentStudent;
