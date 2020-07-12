import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Components.css";

// define AssignmentForm component
const AssignmentForm = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);
  const assignmentId = parseInt(props.match.params.assignmentid);

  // define emptyForm
  const emptyForm = {
    id: assignmentId,
    courseid: courseId,
    title: "",
    description: "",
    duedate: "",
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
            title: assignment.title,
            description: assignment.description,
            duedate: assignment.duedate,
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

  // convert date to string mm/dd/yyyy
  const dateToString = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  };

  // event when due date changes
  const onDueDateChange = (dateSelected) => {
    setFormFields({
      ...formFields,
      duedate: dateToString(dateSelected),
    });
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();
    if (!formFields.title) {
      props.setMessageText(`Validation: Title cannot be blank.`);
      return;
    }
    if (!formFields.description) {
      props.setMessageText(`Validation: Description cannot be blank.`);
      return;
    }
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

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
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
                <td>Title</td>
                <td>
                  <input
                    name="title"
                    onChange={onFieldChange}
                    value={formFields.title}
                    placeholder="title"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <textarea
                    name="description"
                    onChange={onFieldChange}
                    value={formFields.description}
                    rows={5}
                    cols={80}
                  />
                </td>
              </tr>
              <tr>
                <td>Due Date</td>
                <td>
                  <DatePicker
                    selected={Date.parse(formFields.duedate)}
                    onChange={onDueDateChange}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <div>
            <Button type="submit" variant="primary">
              <Icon iconType="add" /> {assignmentId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/assignment/${courseId}`}>
              <Button variant="primary">
                <Icon iconType="back" /> Assignment List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
AssignmentForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default AssignmentForm;
