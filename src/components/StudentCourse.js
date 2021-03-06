import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// StudentCourse Component
const StudentCourse = (props) => {
  // get studentId from currentUser
  const studentId = props.currentUser
    ? props.currentUser.isstudent
      ? props.currentUser.id
      : 0
    : 0;

  // return true if student is enrolled in the course
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

  // show average grade for student
  const getGrade = (courseId) => {
    let totalGrade = 0;
    let countGrade = 0;
    let countAssignment = 0;
    let countAnswer = 0;

    props.assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .forEach((assignment) => {
        countAssignment++;
        const studentAnswer = props.answerList.find(
          (answer) =>
            answer.assignmentid === assignment.id &&
            answer.studentid === studentId
        );
        if (studentAnswer) {
          countAnswer++;
          if (studentAnswer.dategraded) {
            totalGrade += studentAnswer.grade;
            countGrade++;
          }
        }
      });

    // calculate average grade
    let averageGrade = 0;
    if (countGrade > 0) {
      averageGrade = totalGrade / countGrade;
    }
    return {
      assignments: countAssignment,
      answers: countAnswer,
      graded: countGrade,
      average: averageGrade.toFixed(2),
    };
  };

  // shows sort button with the right icon
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
      .filter((course) => enrolledInCourse(course.id))
      .map((course) => {
        const grade = getGrade(course.id);
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
              {grade.answers} of {grade.assignments}
            </td>
            <td>
              {grade.graded} of {grade.assignments}
            </td>
            <td>{grade.average}</td>
            <td>
              <Link to={`/studentassignment/${course.id}`}>
                <Button variant="primary">
                  <Icon iconType="assign" />
                </Button>
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
                  Teacher &nbsp;
                  {renderSortButton("teacherid")}
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
                <th>Assignments Answered</th>
                <th>Assignments Graded</th>
                <th>Average Grade</th>
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
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  courseSort: PropTypes.string.isRequired,
  setCourseSort: PropTypes.func.isRequired,
};

export default StudentCourse;
