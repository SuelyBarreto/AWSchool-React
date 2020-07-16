import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Components.css";

// define AnswerForm component
const AnswerForm = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);
  const answerId = parseInt(props.match.params.answerid);

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

  // find data for current id, put in formFields
  useEffect(() => {
    if (answerId !== 0) {
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
            dategraded: answer.dategraded,
          });
        });
    }
  }, [answerId, props.answerList]);

  // event when form field changes
  const onFieldChange = (event) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

  // convert date to string mm/dd/yyyy
  const dateToString = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  };

  // event when date answered changes
  const onDateAnsweredChange = (dateSelected) => {
    setFormFields({
      ...formFields,
      dateanswered: dateToString(dateSelected),
    });
  };

  // event when date graded changes
  const onDateGradedChange = (dateSelected) => {
    setFormFields({
      ...formFields,
      dategraded: dateToString(dateSelected),
    });
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();

    if (formFields.studentid === 0) {
      props.setMessageText(`Validation: Answer must have a student.`);
      return;
    }
    if (!formFields.answer) {
      props.setMessageText(`Validation: Answer cannot be blank.`);
      return;
    }
    props.onFormSubmit(formFields);
    if (answerId === 0) {
      setFormFields(emptyForm);
    }
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
  const renderStaticStudent = () => {
    const person = props.personList.find(
      (person) => person.id === formFields.studentid
    );
    return person
      ? `${person.id} - ${person.personname}`
      : `${formFields.studentid} - N/A`;
  };

  // show list of student for selection
  const renderStudentOptions = () => {
    // build a list of students enrolled in the course
    const enrolledStudents = props.enrollmentList
      .filter((enrollment) => enrollment.courseid === courseId)
      .map((enrollment) => enrollment.studentid);

    // build a list of students that already answered
    const alreadyAnswered = props.answerList
      .filter((answer) => answer.assignmentid === assignmentId)
      .map((answer) => answer.studentid);

    // build a list of students available to answer
    const availableStudents = props.personList.filter(
      (person) =>
        person.isstudent &&
        enrolledStudents.includes(person.id) &&
        !alreadyAnswered.includes(person.id)
    );

    let allStudents = [];
    if (formFields.studentid === 0) {
      allStudents.push(
        <option value={0} key={0}>
          0 - Not selected
        </option>
      );
    }
    availableStudents.forEach((person) => {
      allStudents.push(
        <option value={person.id} key={person.id}>
          {person.id} - {person.personname}
        </option>
      );
    });
    return allStudents;
  };

  // show student dropdown when adding
  const renderStudent = () => {
    if (answerId === 0) {
      return (
        <select
          name="studentid"
          value={formFields.studentid}
          onChange={onFieldChange}
        >
          {renderStudentOptions()};
        </select>
      );
    } else {
      return renderStaticStudent();
    }
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h3>Answer Form</h3>
        <form onSubmit={onSubmit}>
          <Table hover>
            <tbody>
              <tr>
                <td>Answer Id</td>
                <td>{formFields.id === 0 ? `New` : formFields.id}</td>
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
                <td>
                  <textarea
                    name="answer"
                    onChange={onFieldChange}
                    value={formFields.answer}
                    rows={5}
                    cols={80}
                  />
                </td>
              </tr>
              <tr>
                <td>Date Answered</td>
                <td>
                  <DatePicker
                    selected={Date.parse(formFields.dateanswered)}
                    onChange={onDateAnsweredChange}
                  />
                </td>
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
                <td>
                  <DatePicker
                    selected={Date.parse(formFields.dategraded)}
                    onChange={onDateGradedChange}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <div>
            <Button type="submit" variant="primary">
              <Icon iconType="add" /> {answerId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/answer/${courseId}/${assignmentId}`}>
              <Button variant="primary">
                <Icon iconType="back" /> Answer List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
AnswerForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default AnswerForm;
