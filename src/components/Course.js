import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import "./Course.css";

const renderCourse = (courseList) => {
  return courseList.map((course, index) => {
    return (
      <tr key={index}>
        <td>{course.title}</td>
        <td>{course.description}</td>
        <td>{course.teacherid}</td>
        <td>{course.startdate}</td>
        <td>{course.enddate}</td>
        <td>{course.passgrade}</td>
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

// Course Component
const Course = (props) => {
  console.log(`rendering courses...`, props);
  return (
    <div>
      <h1>Course</h1>
      <div className="courselistlist">
        <Table hover>
          <thead>
            <tr>
              <td>Title</td>
              <td>Description</td>
              <td>Teacher</td>
              <td>Start Date</td>
              <td>End Date</td>
              <td>Passing Grade</td>
              <td>Select</td>
            </tr>
          </thead>
          <tbody>{renderCourse(props.courseList)}</tbody>
        </Table>
        <p>
          <Button variant="primary">Add Course</Button>
        </p>
      </div>
    </div>
  );
};

Course.propTypes = {
  courseList: PropTypes.array.isRequired,
};

export default Course;
