import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
// TODO from Assignment
// StudentAssignment Component
const StudentAssignment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

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

  // render studentAssignment
  const renderStudentAssignment = (studentAssignmentList) => {
    return studentAssignmentList
      .filter((studentAssignment) => studentAssignment.courseid === courseId)
      .map((studentAssignment) => {
        return (
          <tr key={studentAssignment.id}>
            <td>{studentAssignment.id}</td>
            <td>{studentAssignment.title}</td>
            <td>{studentAssignment.description}</td>
            <td>{studentAssignment.duedate}</td>
            <td>
              <Link to={`/answer/${courseId}/${studentAssignment.id}`}>
                <Button variant="primary">Answers</Button>
              </Link>
              &nbsp;
              <Link
                to={`/studentAssignmentform/${courseId}/${studentAssignment.id}`}
              >
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onStudentAssignmentDelete(studentAssignment.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });
  };

  // render main form
  return (
    <div>
      <h1>StudentAssignments: Course {renderCourse()}</h1>
      <div className="studentAssignmentlistlist">
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
          <tbody>{renderStudentAssignment(props.studentAssignmentList)}</tbody>
        </Table>
        <p>
          <Link to={`/studentAssignmentform/${courseId}/0`}>
            <Button variant="primary">Add New</Button>
          </Link>
          &nbsp;
          <Link to={`/course`}>
            <Button variant="primary">Course List</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

// define prop types
StudentAssignment.propTypes = {
  studentAssignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  onStudentAssignmentDelete: PropTypes.func.isRequired,
};

export default StudentAssignment;
