import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// define AssignmentForm component
const AssignmentForm = (props) => {
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.id);

  // define emptyForm
  const emptyForm = {
    id: assignmentId,
    courseid: courseId,
    studentid: 0,
    averagegrade: 0,
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // find data for current id, put in formFields
  useEffect(() => {
    if (assignmentId !== 0) {
      props.assignmentList.forEach((assignment) => {
        if (assignment.id === assignmentId) {
          setFormFields({
            id: assignment.id,
            courseid: assignment.courseid,
            studentid: assignment.studentid,
            averagegrade: assignment.averagegrade,
          });
        }
      });
    }
  }, [assignmentId, props.assignmentList]);

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
    if (assignmentId === 0) {
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

  // show list of student for selection
  const renderStudent = () => {
    // build a list of student ids already enrolled
    const enrolledStudents = props.assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .map((assignment) => assignment.studentid);

    // includes course teacher in enrolled students list
    // to avoid adding the teacher as student
    const teacherId = props.courseList.find((course) => course.id === courseId)
      .teacherid;
    enrolledStudents.push(teacherId);
    console.log(teacherId, enrolledStudents);

    // build a list of students available to enroll
    const availableStudents = props.personList.filter(
      (person) => person.isstudent && !enrolledStudents.includes(person.id)
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

  // main form
  return (
    <div>
      <h3>Assignment Form</h3>
      <form onSubmit={onSubmit}>
        <Table hover>
          <tbody>
            <tr>
              <td>Assignment Id</td>
              <td>{formFields.id === 0 ? `New` : formFields.id}</td>
            </tr>
            <tr>
              <td>Course</td>
              <td>{renderCourse()}</td>
            </tr>
            <tr>
              <td>Student</td>
              <td>
                <select
                  name="studentid"
                  value={formFields.studentid}
                  onChange={onFieldChange}
                >
                  {renderStudent()};
                </select>
              </td>
            </tr>
            <tr>
              <td>Grade</td>
              <td>
                <input
                  name="grade"
                  onChange={onFieldChange}
                  value={formFields.averagegrade}
                  placeholder="grade"
                  type="text"
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <div>
          <Button type="submit" variant="primary">
            {assignmentId === 0 ? "Add" : "Save"}
          </Button>
          &nbsp;
          <Link to={`/assignment/${courseId}`}>
            <Button variant="primary">Assignment List</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

AssignmentForm.propTypes = {
  assignmentList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default AssignmentForm;
