import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// define EnrollmentForm component
const EnrollmentForm = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const enrollmentId = parseInt(props.match.params.enrollmentid);

  // define emptyForm
  const emptyForm = {
    id: enrollmentId,
    courseid: courseId,
    studentid: 0,
    averagegrade: 0,
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // find data for current id, put in formFields
  useEffect(() => {
    if (enrollmentId !== 0) {
      props.enrollmentList.forEach((enrollment) => {
        if (enrollment.id === enrollmentId) {
          setFormFields({
            id: enrollment.id,
            courseid: enrollment.courseid,
            studentid: enrollment.studentid,
            averagegrade: enrollment.averagegrade,
          });
        }
      });
    }
  }, [enrollmentId, props.enrollmentList]);

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

    if (formFields.studentid === 0) {
      props.setMessageText(`Validation: Enrollment must have a student.`);
      return;
    }
    props.onFormSubmit(formFields);
    if (enrollmentId === 0) {
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
    // build a list of student ids already enrolled
    const enrolledStudents = props.enrollmentList
      .filter((enrollment) => enrollment.courseid === courseId)
      .map((enrollment) => enrollment.studentid);

    // includes course teacher in enrolled students list
    // to avoid adding the teacher as student
    const teacherId = props.courseList.find((course) => course.id === courseId)
      .teacherid;
    enrolledStudents.push(teacherId);

    // build a list of students available to enroll
    const availableStudents = props.personList.filter(
      (person) => person.isstudent && !enrolledStudents.includes(person.id)
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
    if (enrollmentId === 0) {
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
        <h3>Enrollment Form</h3>
        <form onSubmit={onSubmit}>
          <Table hover>
            <tbody>
              <tr>
                <td>Enrollment Id</td>
                <td>{formFields.id === 0 ? `New` : formFields.id}</td>
              </tr>
              <tr>
                <td>Course</td>
                <td>{renderCourse()}</td>
              </tr>
              <tr>
                <td>Student</td>
                <td>{renderStudent()}</td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>
                  <input
                    name="averagegrade"
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
              {enrollmentId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/enrollment/${courseId}`}>
              <Button variant="primary">
                <Icon iconType="back" /> Enrollment List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
EnrollmentForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default EnrollmentForm;
