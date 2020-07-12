import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// TeacherCourse Component
const TeacherCourse = (props) => {
  // get teacherId from currentUser
  const teacherId = props.currentUser
    ? props.currentUser.isteacher
      ? props.currentUser.id
      : 0
    : 0;

  // render course
  const renderCourse = () => {
    return props.courseList
      .filter((course) => course.teacherid === teacherId)
      .map((course) => {
        return (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.title}</td>
            <td>{course.description}</td>
            <td>{course.startdate}</td>
            <td>{course.enddate}</td>
            <td>{course.passgrade}</td>
            <td>
              <Link to={`/teacherenrollment/${course.id}`}>
                <Button variant="primary">
                  <Icon iconType="enroll" />
                </Button>
              </Link>
              &nbsp;
              <Link to={`/teacherassignment/${course.id}`}>
                <Button variant="primary">
                  <Icon iconType="assign" />
                </Button>
              </Link>
            </td>
          </tr>
        );
      });
  };

  // check if current user is teacher
  if (teacherId === 0) {
    return <h3>Requires Teacher Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Course</h1>
        <h3>
          Teacher: {props.currentUser.id} - {props.currentUser.personname}
        </h3>
        <div className="courselistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Passing Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderCourse()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
};

// define prop types
TeacherCourse.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
};

export default TeacherCourse;
