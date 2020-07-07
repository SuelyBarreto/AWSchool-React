import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Course Component
const Course = (props) => {
  // return teacher id and name
  const renderTeacher = (teacherid) => {
    let teacherName = `${teacherid} - Invalid Id`;
    props.personList.forEach((person) => {
      if (person.id === teacherid) {
        if (person.isteacher) {
          teacherName = `${person.id} - ${person.personname}`;
        } else {
          teacherName = `${teacherid} - Invalid Teacher`;
        }
      }
    });
    return teacherName;
  };

  // render course
  const renderCourse = () => {
    return props.courseList.map((course) => {
      return (
        <tr key={course.id}>
          <td>{course.id}</td>
          <td>{course.title}</td>
          <td>{course.description}</td>
          <td>{renderTeacher(course.teacherid)}</td>
          <td>{course.startdate}</td>
          <td>{course.enddate}</td>
          <td>{course.passgrade}</td>
          <td>
            <Link to={`/enrollment/${course.id}`}>
              <Button variant="primary">Enrollment</Button>
            </Link>
            &nbsp;
            <Link to={`/assignment/${course.id}`}>
              <Button variant="primary">Assignments</Button>
            </Link>
            &nbsp;
            <Link to={`/courseform/${course.id}`}>
              <Button variant="primary">Edit</Button>
            </Link>
            &nbsp;
            <Button
              variant="primary"
              onClick={() => {
                props.onCourseDelete(course.id);
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
      <h1>Course</h1>
      <div className="courselistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>Teacher - Id</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Passing Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderCourse()}</tbody>
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

// define prop types
Course.propTypes = {
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onCourseDelete: PropTypes.func.isRequired,
};

export default Course;
