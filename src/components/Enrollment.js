import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./Enrollment.css";

// Enrollment Component
const Enrollment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.id);

  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  const renderStudent = (studentId) => {
    let studentName = `${studentId} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === studentId) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
  };

  const renderEnrollment = (enrollmentList) => {
    return enrollmentList
      .filter((enrollment) => enrollment.courseid === courseId)
      .map((enrollment, index) => {
        return (
          <tr key={index}>
            <td>{renderStudent(enrollment.studentid)}</td>
            <td>{enrollment.averagegrade}</td>
            <td>
              <Button variant="primary">Edit</Button>
              &nbsp;
              <Button variant="primary">Delete</Button>
            </td>
          </tr>
        );
      });
  };

  return (
    <div>
      <h1>Course {renderCourse()}</h1>
      <div className="enrollmentlistlist">
        <Table hover>
          <thead>
            <tr>
              <td>Student Id</td>
              <td>Grade</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
        </Table>
        <p>
          <Button variant="primary">Add Student</Button>
        </p>
      </div>
    </div>
  );
};

Enrollment.propTypes = {
  enrollmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
};

export default Enrollment;
