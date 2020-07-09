import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
// TODO from Assignment
// TeacherAssignment Component
const TeacherAssignment = (props) => {
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

  // render teacherAssignment
  const renderTeacherAssignment = (teacherAssignmentList) => {
    return teacherAssignmentList
      .filter((teacherAssignment) => teacherAssignment.courseid === courseId)
      .map((teacherAssignment) => {
        return (
          <tr key={teacherAssignment.id}>
            <td>{teacherAssignment.id}</td>
            <td>{teacherAssignment.title}</td>
            <td>{teacherAssignment.description}</td>
            <td>{teacherAssignment.duedate}</td>
            <td>
              <Link to={`/answer/${courseId}/${teacherAssignment.id}`}>
                <Button variant="primary">Answers</Button>
              </Link>
              &nbsp;
              <Link
                to={`/teacherAssignmentform/${courseId}/${teacherAssignment.id}`}
              >
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onTeacherAssignmentDelete(teacherAssignment.id);
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
      <h1>TeacherAssignments: Course {renderCourse()}</h1>
      <div className="teacherAssignmentlistlist">
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
          <tbody>{renderTeacherAssignment(props.teacherAssignmentList)}</tbody>
        </Table>
        <p>
          <Link to={`/teacherAssignmentform/${courseId}/0`}>
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
TeacherAssignment.propTypes = {
  teacherAssignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  onTeacherAssignmentDelete: PropTypes.func.isRequired,
};

export default TeacherAssignment;
