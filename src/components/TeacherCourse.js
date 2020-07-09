import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
// TODO Course
// TeacherCourse Component
const TeacherCourse = (props) => {
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

  // render teacherCourse
  const renderTeacherCourse = () => {
    return props.teacherCourseList.map((teacherCourse) => {
      return (
        <tr key={teacherCourse.id}>
          <td>{teacherCourse.id}</td>
          <td>{teacherCourse.title}</td>
          <td>{teacherCourse.description}</td>
          <td>{renderTeacher(teacherCourse.teacherid)}</td>
          <td>{teacherCourse.startdate}</td>
          <td>{teacherCourse.enddate}</td>
          <td>{teacherCourse.passgrade}</td>
          <td>
            <Link to={`/enrollment/${teacherCourse.id}`}>
              <Button variant="primary">Enrollment</Button>
            </Link>
            &nbsp;
            <Link to={`/assignment/${teacherCourse.id}`}>
              <Button variant="primary">Assignments</Button>
            </Link>
            &nbsp;
            <Link to={`/teacherCourseform/${teacherCourse.id}`}>
              <Button variant="primary">Edit</Button>
            </Link>
            &nbsp;
            <Button
              variant="primary"
              onClick={() => {
                props.onTeacherCourseDelete(teacherCourse.id);
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
      <h1>TeacherCourse</h1>
      <div className="teacherCourselistlist">
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
          <tbody>{renderTeacherCourse()}</tbody>
        </Table>
        <p>
          <Link to="/teacherCourseform/0">
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

// define prop types
TeacherCourse.propTypes = {
  teacherCourseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onTeacherCourseDelete: PropTypes.func.isRequired,
};

export default TeacherCourse;
