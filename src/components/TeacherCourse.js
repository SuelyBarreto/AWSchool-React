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

  //
  const renderSortButton = (column) => {
    const iconType = column === props.courseSort ? "sort1" : "sort2";
    return (
      <span
        onClick={() => {
          props.setCourseSort(column);
        }}
      >
        <Icon iconType={iconType} />
      </span>
    );
  };

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
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>
                  Id &nbsp;
                  {renderSortButton("id")}
                </th>
                <th>
                  Title &nbsp;
                  {renderSortButton("title")}
                </th>
                <th>
                  Description &nbsp;
                  {renderSortButton("description")}
                </th>
                <th>
                  Start Date &nbsp;
                  {renderSortButton("startdate")}
                </th>
                <th>
                  End Date &nbsp;
                  {renderSortButton("enddate")}
                </th>
                <th>
                  Passing Grade &nbsp;
                  {renderSortButton("passgrade")}
                </th>
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
  courseSort: PropTypes.string.isRequired,
  setCourseSort: PropTypes.func.isRequired,
};

export default TeacherCourse;
