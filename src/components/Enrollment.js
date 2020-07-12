import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Enrollment Component
const Enrollment = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  // render course
  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  // render student
  const renderStudent = (studentId) => {
    let studentName = `${studentId} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === studentId) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
  };

  // render enrollment
  const renderEnrollment = (enrollmentList) => {
    return enrollmentList
      .filter((enrollment) => enrollment.courseid === courseId)
      .map((enrollment) => {
        return (
          <tr key={enrollment.id}>
            <td>{enrollment.id}</td>
            <td>{renderStudent(enrollment.studentid)}</td>
            <td>{enrollment.averagegrade}</td>
            <td>
              <Link to={`/enrollmentform/${courseId}/${enrollment.id}`}>
                <Button variant="primary">
                  <Icon iconType="edit" />
                </Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  if (window.confirm("Confirm delete?")) {
                    props.onEnrollmentDelete(enrollment.id);
                  }
                }}
              >
                <Icon iconType="delete" />
              </Button>
            </td>
          </tr>
        );
      });
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Enrollment: Course {renderCourse()}</h1>
        <div className="enrollmentlistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Student Id</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/enrollmentform/${courseId}/0`}>
              <Button variant="primary">
                <Icon iconType="add" /> Add New
              </Button>
            </Link>
            &nbsp;
            <Link to={`/course`}>
              <Button variant="primary">
                <Icon iconType="back" /> Course List
              </Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
Enrollment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  onEnrollmentDelete: PropTypes.func.isRequired,
};

export default Enrollment;
