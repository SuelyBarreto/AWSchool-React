import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";
import Assignment from "./Assignment";
// TODO from Answer
// StudentAnswer Component
const StudentAnswer = (props) => {
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

  // render studentAnswer
  const renderStudentAnswer = (studentAnswerList) => {
    return studentAnswerList
      .filter((studentAnswer) => studentAnswer.assignmentid === assignmentId)
      .map((studentAnswer) => {
        return (
          <tr key={studentAnswer.id}>
            <td>{studentAnswer.id}</td>
            <td>{renderStudent(studentAnswer.studentid)}</td>
            <td>{studentAnswer.studentAnswer}</td>
            <td>{studentAnswer.datestudentAnswered}</td>
            <td>{studentAnswer.grade}</td>
            <td>{studentAnswer.dategraded}</td>
            <td>
              <Link
                to={`/studentAnswerform/${courseId}/${assignmentId}/${studentAnswer.id}`}
              >
                <Button variant="primary">Edit</Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  props.onStudentAnswerDelete(studentAnswer.id);
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
        StudentAnswers: Assignment {renderAssignment()} (Course {renderCourse()}
        )
      </h1>
      <div className="studentAnswerlistlist">
        <Table hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Student</th>
              <th>StudentAnswer</th>
              <th>Date StudentAnswered</th>
              <th>Grade</th>
              <th>Date Graded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderStudentAnswer(props.studentAnswerList)}</tbody>
        </Table>
        <p>
          <Link to={`/studentAnswerform/${courseId}/${assignmentId}/0`}>
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
StudentAnswer.propTypes = {
  studentAnswerList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onStudentAnswerDelete: PropTypes.func.isRequired,
};

export default StudentAnswer;
