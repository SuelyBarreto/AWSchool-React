import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Course.css";

const renderCourse = (courseList, onCourseDelete) => {
  // TODO
  return courseList.map((course, index) => {
    return (
      <tr key={index}>
        <td>{course.id}</td>
        <td>{course.title}</td>
        <td>{course.description}</td>
        <td>{course.teacherid}</td>
        <td>{course.startdate}</td>
        <td>{course.enddate}</td>
        <td>{course.passgrade}</td>
        <td>
          {/* TODO */}
          <Link to={`/courseform/${course.id}`}>
            <Button variant="primary">Edit</Button>
          </Link>
        </td>
        <td>
          {/* TODO */}
          <Button
            variant="primary"
            onClick={() => {
              onCourseDelete(course.id);
            }}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  });
};

// Course Component
const Course = (props) => {
  return (
    <div>
      <h1>Course</h1>
      <div className="courselistlist">
        <Table hover>
          <thead>
            <tr>
              <td>Id</td>
              <td>Title</td>
              <td>Description</td>
              <td>Teacher</td>
              <td>Start Date</td>
              <td>End Date</td>
              <td>Passing Grade</td>
              <td>Select</td>
            </tr>
          </thead>
          <tbody>{renderCourse(props.courseList, props.onCourseDelete)}</tbody>
          {/* TODO */}
        </Table>
        <p>
          <Link to="/courseform/0">
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

Course.propTypes = {
  courseList: PropTypes.array.isRequired,
  onCourseDelete: PropTypes.func.isRequired, // TODO
};

export default Course;
