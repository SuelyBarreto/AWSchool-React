import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  };

  // find data for current id, put in formFields
  useEffect(() => {
    props.answerList.forEach((answer) => {
      if (answer.id === answerId) {
        setFormFields({
          id: answer.id,
          assignmentid: answer.assignmentid,
          studentid: answer.studentid,
          answer: answer.answer,
          dateanswered: answer.dateanswered,
          grade: answer.grade,
          dategraded: dateToString(new Date()),
        });
      }
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
        assignmentTitle = `${assignment.id} - ${assignment.title}`;
      }
    });
    return assignmentTitle;
  };

  // return current student id and name
  const renderStudent = () => {
    let studentName = `${formFields.studentid} - N/A`;
    props.personList.forEach((person) => {
      if (person.id === formFields.studentid) {
        studentName = `${person.id} - ${person.personname}`;
      }
    });
    return studentName;
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
              Save
            </Button>
            &nbsp;
            <Link to={`/teacheranswer/${courseId}/${assignmentId}`}>
              <Button variant="primary">Answer List</Button>
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
  answerList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default TeacherAnswerForm;
