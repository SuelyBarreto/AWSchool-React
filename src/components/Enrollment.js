import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Enrollment Component
const Enrollment = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

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
              <Link to={`/enrollmentform/${courseId}/${enrollment.id}`}>
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onEnrollmentDelete(enrollment.id);
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });
  };

  return (
    <div>
      <h1>Enrollment: Course {renderCourse()}</h1>
      <div className="enrollmentlistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Student Id</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderEnrollment(props.enrollmentList)}</tbody>
        </Table>
        <p>
          <Link to={`/enrollmentform/${courseId}/0`}>
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

Enrollment.propTypes = {
  enrollmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onEnrollmentDelete: PropTypes.func.isRequired,
};

export default Enrollment;
