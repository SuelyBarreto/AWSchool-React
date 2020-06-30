import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./CourseStudent.css";

const renderCourseStudent = (courseStudentList) => {
  return courseStudentList.map((courseStudent, index) => {
    return (
      <tr key={index}>
        <td>{courseStudent.courseid}</td>
        <td>{courseStudent.studentid}</td>
        <td>{courseStudent.averagegrade}</td>
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

// CourseStudent Component
const CourseStudent = (props) => {
  console.log(`rendering courseStudents...`, props);
  return (
    <div>
      <h1>CourseStudent</h1>
      <div className="courseStudentlistlist">
        <Table hover>
          <thead>
            <tr>
              <td>Course Id</td>
              <td>Student Id</td>
              <td>Average Grade</td>
              <td>Select</td>
            </tr>
          </thead>
          <tbody>{renderCourseStudent(props.courseStudentList)}</tbody>
        </Table>
        <p>
          <Button variant="primary">Add CourseStudent</Button>
        </p>
      </div>
    </div>
  );
};

CourseStudent.propTypes = {
  courseStudentList: PropTypes.array.isRequired,
};

export default CourseStudent;
