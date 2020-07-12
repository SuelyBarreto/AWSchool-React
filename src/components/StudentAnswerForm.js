import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// define StudentAnswerForm component
const StudentAnswerForm = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);
  const answerId = parseInt(props.match.params.answerid);

  const enrolledInCourse = (studentId) => {
    const enrolled = props.enrollmentList.find(
      (enrollment) =>
        enrollment.courseid === courseId && enrollment.studentid === studentId
    );
    return enrolled;
  };

  // get studentId from currentUser, check if enrolled
  const studentId = props.currentUser
    ? props.currentUser.isstudent
      ? enrolledInCourse(props.currentUser.id)
        ? props.currentUser.id
        : 0
      : 0
    : 0;

  // convert date to string mm/dd/yyyy
  const dateToString = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  };

  // define emptyForm
  const emptyForm = {
    id: answerId,
    assignmentid: assignmentId,
    studentid: studentId,
    answer: "",
    dateanswered: dateToString(new Date()),
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
            dateanswered: dateToString(new Date()),
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

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();

    if (!formFields.answer) {
      props.setMessageText(`Validation: Answer cannot be blank.`);
      return;
    }
    props.onFormSubmit(formFields);
    props.history.goBack();
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

  // return assignment id and title
  const renderAssignment = () => {
    let assignmentTitle = `${assignmentId} - N/A`;
    props.assignmentList.forEach((assignment) => {
      if (assignment.id === assignmentId) {
        assignmentTitle = `${assignment.id} - ${assignment.title}:\n ${assignment.description}`;
      }
    });
    return assignmentTitle;
  };

  // return student id and name
  const renderStudent = () => {
    return `${props.currentUser.id} - ${props.currentUser.personname}`;
  };

  // check if current user is student
  if (studentId === 0) {
    return <h3>Requires Student Login</h3>;
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
                <td>{formFields.dateanswered}</td>
              </tr>
            </tbody>
          </Table>
          <div>
            <Button type="submit" variant="primary">
              <Icon iconType="add" /> {answerId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/studentassignment/${courseId}/`}>
              <Button variant="primary">
                <Icon iconType="back" />
                Assignment List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
StudentAnswerForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default StudentAnswerForm;
