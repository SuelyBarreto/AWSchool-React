import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
import Assignment from "./Assignment";
// TODO from Answer
// TeacherAnswer Component
const TeacherAnswer = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);

  // return course id and title
  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${course.id} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  // return assignment id and title
  const renderAssignment = () => {
    let assignmentTitle = `${assignmentId} - N/A`;
    props.assignmentList.forEach((assignment) => {
      if (assignment.id === assignmentId) {
        assignmentTitle = `${assignment.id} - ${assignment.title}`;
      }
    });
    return assignmentTitle;
  };

  // return student id and name
  const renderStudent = (studentid) => {
    let studentName = `${studentid} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === studentid) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
  };

  // render teacherAnswer
  const renderTeacherAnswer = (teacherAnswerList) => {
    return teacherAnswerList
      .filter((teacherAnswer) => teacherAnswer.assignmentid === assignmentId)
      .map((teacherAnswer) => {
        return (
          <tr key={teacherAnswer.id}>
            <td>{teacherAnswer.id}</td>
            <td>{renderStudent(teacherAnswer.studentid)}</td>
            <td>{teacherAnswer.teacherAnswer}</td>
            <td>{teacherAnswer.dateteacherAnswered}</td>
            <td>{teacherAnswer.grade}</td>
            <td>{teacherAnswer.dategraded}</td>
            <td>
              <Link
                to={`/teacherAnswerform/${courseId}/${assignmentId}/${teacherAnswer.id}`}
              >
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onTeacherAnswerDelete(teacherAnswer.id);
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
      <h1>
        TeacherAnswers: Assignment {renderAssignment()} (Course {renderCourse()}
        )
      </h1>
      <div className="teacherAnswerlistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Student</th>
              <th>TeacherAnswer</th>
              <th>Date TeacherAnswered</th>
              <th>Grade</th>
              <th>Date Graded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderTeacherAnswer(props.teacherAnswerList)}</tbody>
        </Table>
        <p>
          <Link to={`/teacherAnswerform/${courseId}/${assignmentId}/0`}>
            <Button variant="primary">Add New</Button>
          </Link>
          &nbsp;
          <Link to={`/assignment/${courseId}`}>
            <Button variant="primary">Assignment List</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

// define prop types
TeacherAnswer.propTypes = {
  teacherAnswerList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onTeacherAnswerDelete: PropTypes.func.isRequired,
};

export default TeacherAnswer;
