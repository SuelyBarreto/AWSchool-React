import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
import TeacherCourse from "./TeacherCourse";

// Enrollment Component
const Enrollment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  // get teacherId from currentUser
  // check it is the teacher for the course
  const teacherId = props.currentUser
    ? props.currentUser.isteacher
      ? props.courseList.find(
          (course) =>
            course.teacherid === props.currentUser.id && course.id === courseId
        )
        ? props.currentUser.id
        : 0
      : 0
    : 0;

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
        <h1>Enrollment: Course {renderCourse()}</h1>
        <div className="enrollmentlistlist">
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Student Id</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/teachercourse`}>
              <Button variant="primary">Course List</Button>
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
  enrollmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
};

export default Enrollment;
