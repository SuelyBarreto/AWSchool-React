import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Components.css";

// define AnswerForm component
const AnswerForm = (props) => {
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
      props.answerList.forEach((answer) => {
        if (answer.id === answerId) {
          setFormFields({
            id: answer.id,
            assignmentid: answer.assignmentid,
            studentid: answer.studentid,
            answer: answer.answer,
            dateanswered: answer.dateanswered,
            grade: answer.grade,
            dategraded: answer.dategraded,
          });
        }
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
    props.onFormSubmit(formFields);
    if (answerId === 0) {
      setFormFields(emptyForm);
    }
  };

  // return current course id and title
  const renderCourse = () => {
    let courseTitle = `${courseId} - N/A`;
    props.courseList.forEach((course) => {
      if (course.id === courseId) {
        courseTitle = `${courseId} - ${course.title}`;
      }
    });
    return courseTitle;
  };

  const renderAssignment = () => {
    let assignmentTitle = `${assignmentId} - N/A`;
    props.assignmentList.forEach((assignment) => {
      if (assignment.id === assignmentId) {
        assignmentTitle = `${assignment.id} - ${assignment.title}`;
      }
    });
    return assignmentTitle;
  };

  // return current student id and name
  const renderStaticStudent = () => {
    let studentName = `${formFields.studentid} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === formFields.studentid) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
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
        <option value="0" key="0">
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

  // show student dropdown if adding
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

  // main form
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
            {answerId === 0 ? "Add" : "Save"}
          </Button>
          &nbsp;
          <Link to={`/answer/${courseId}/${assignmentId}`}>
            <Button variant="primary">Answer List</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

AnswerForm.propTypes = {
  answerList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default AnswerForm;