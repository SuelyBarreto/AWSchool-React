import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// define TeacherAnswerForm component
const TeacherAnswerForm = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);
  const answerId = parseInt(props.match.params.answerid);

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

  // define emptyForm
  const emptyForm = {
    id: answerId,
    assignmentid: assignmentId,
    studentid: 0,
    answer: "",
    dateanswered: "",
    grade: 0,
    dategraded: "",
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // convert date to string mm/dd/yyyy
  const dateToString = (date) => {
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  };

  // find data for current id, put in formFields
  useEffect(() => {
    props.answerList
      .filter((answer) => answer.id === answerId)
      .forEach((answer) => {
        setFormFields({
          id: answer.id,
          assignmentid: answer.assignmentid,
          studentid: answer.studentid,
          answer: answer.answer,
          dateanswered: answer.dateanswered,
          grade: answer.grade,
          dategraded: dateToString(new Date()),
        });
      });
  }, [answerId, props.answerList]);

  // event when form field changes
  const onFieldChange = (event) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit(formFields);
    props.history.goBack();
  };

  // return course id and title
  const renderCourse = () => {
    const course = props.courseList.find((course) => course.id === courseId);
    return course ? `${course.id} - ${course.title}` : `${courseId} - N/A`;
  };

  // return assignment id and title
  const renderAssignment = () => {
    const assignment = props.assignmentList.find(
      (assignment) => assignment.id === assignmentId
    );
    return assignment
      ? `${assignment.id} - ${assignment.title}`
      : `${assignmentId} - N/A`;
  };

  // return student id and name
  const renderStudent = () => {
    const person = props.personList.find(
      (person) => person.id === formFields.studentid
    );
    return person
      ? `${person.id} - ${person.personname}`
      : `${formFields.studentid} - N/A`;
  };

  // check if current user is teacher
  if (teacherId === 0) {
    return <h3>Requires Teacher Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h3>Grading Form</h3>
        <form onSubmit={onSubmit}>
          <Table hover>
            <tbody>
              <tr>
                <td>Answer Id</td>
                <td>{formFields.id}</td>
              </tr>
              <tr>
                <td>Course</td>
                <td>{renderCourse()}</td>
              </tr>
              <tr>
                <td>Assignment</td>
                <td>{renderAssignment()}</td>
              </tr>
              <tr>
                <td>Student</td>
                <td>{renderStudent()}</td>
              </tr>
              <tr>
                <td>Answer</td>
                <td>{formFields.answer}</td>
              </tr>
              <tr>
                <td>Date Answered</td>
                <td>{formFields.dateanswered}</td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>
                  <input
                    name="grade"
                    onChange={onFieldChange}
                    value={formFields.grade}
                    placeholder="grade"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>Date Graded</td>
                <td>{formFields.dategraded}</td>
              </tr>
            </tbody>
          </Table>
          <div>
            <Button type="submit" variant="primary">
              <Icon iconType="add" />
              Save
            </Button>
            &nbsp;
            <Link to={`/teacheranswer/${courseId}/${assignmentId}`}>
              <Button variant="primary">
                <Icon iconType="back" />
                Answer List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
TeacherAnswerForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default TeacherAnswerForm;
