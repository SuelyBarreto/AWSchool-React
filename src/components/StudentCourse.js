import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// StudentCourse Component
const StudentCourse = (props) => {
  // get studentId from currentUser
  const studentId = props.currentUser
    ? props.currentUser.isstudent
      ? props.currentUser.id
      : 0
    : 0;

  const enrolledInCourse = (courseId) => {
    const enrolled = props.enrollmentList.find(
      (enrollment) =>
        enrollment.courseid === courseId && enrollment.studentid === studentId
    );
    return enrolled;
  };

  // return teacher id and name
  const renderTeacher = (teacherid) => {
    const teacher = props.personList.find((person) => person.id === teacherid);
    if (teacher) {
      return `${teacher.id} - ${teacher.personname}`;
    } else {
      return `${teacherid} - Invalid Teacher`;
    }
  };

  // render course
  const renderCourse = () => {
    return props.courseList
      .filter((course) => enrolledInCourse(course.id))
      .map((course) => {
        return (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.title}</td>
            <td>{renderTeacher(course.teacherid)}</td>
            <td>{course.description}</td>
            <td>{course.startdate}</td>
            <td>{course.enddate}</td>
            <td>{course.passgrade}</td>
            <td>
              <Link to={`/studentassignment/${course.id}`}>
                <Button variant="primary">Assignments</Button>
              </Link>
            </td>
          </tr>
        );
      });
  };

  // check if current user is student
  if (studentId === 0) {
    return <h3>Requires Student Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Course</h1>
        <h3>
          Student: {props.currentUser.id} - {props.currentUser.personname}
        </h3>
        <div className="courselistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Teacher</th>
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
StudentCourse.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
};

export default StudentCourse;
