import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// StudentCourse Component
const StudentCourse = (props) => {
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

  // render studentCourse
  const renderStudentCourse = () => {
    return props.studentCourseList.map((studentCourse) => {
      return (
        <tr key={studentCourse.id}>
          <td>{studentCourse.id}</td>
          <td>{studentCourse.title}</td>
          <td>{studentCourse.description}</td>
          <td>{renderTeacher(studentCourse.teacherid)}</td>
          <td>{studentCourse.startdate}</td>
          <td>{studentCourse.enddate}</td>
          <td>{studentCourse.passgrade}</td>
          <td>
            <Link to={`/enrollment/${studentCourse.id}`}>
              <Button variant="primary">Enrollment</Button>
            </Link>
            &nbsp;
            <Link to={`/assignment/${studentCourse.id}`}>
              <Button variant="primary">Assignments</Button>
            </Link>
            &nbsp;
            <Link to={`/studentCourseform/${studentCourse.id}`}>
              <Button variant="primary">Edit</Button>
            </Link>
            &nbsp;
            <Button
              variant="primary"
              onClick={() => {
                props.onStudentCourseDelete(studentCourse.id);
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
      <h1>StudentCourse</h1>
      <div className="studentCourselistlist">
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
          <tbody>{renderStudentCourse()}</tbody>
        </Table>
        <p>
          <Link to="/studentCourseform/0">
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

// define prop types
StudentCourse.propTypes = {
  currentUser: PropTypes.object.isRequired,
  studentCourseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onStudentCourseDelete: PropTypes.func.isRequired,
};

export default StudentCourse;
