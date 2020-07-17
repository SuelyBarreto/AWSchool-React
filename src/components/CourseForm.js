import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Components.css";

// define CourseForm component
const CourseForm = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  // define emptyForm
  const emptyForm = {
    id: 0,
    teacherid: 0,
    title: "",
    description: "",
    startdate: "",
    enddate: "",
    passgrade: 0,
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // find data for current id, put in formFields
  useEffect(() => {
    if (courseId !== 0) {
      props.courseList
        .filter((course) => course.id === courseId)
        .forEach((course) => {
          setFormFields({
            id: course.id,
            teacherid: course.teacherid,
            title: course.title,
            description: course.description,
            startdate: course.startdate,
            enddate: course.enddate,
            passgrade: course.passgrade,
          });
        });
    }
  }, [courseId, props.courseList]);

  // event when form field changes
  const onFieldChange = (event) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

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

  // event when start date changes
  const onStartDateChange = (dateSelected) => {
    setFormFields({
      ...formFields,
      startdate: dateToString(dateSelected),
    });
  };

  // event when end date changes
  const onEndDateChange = (dateSelected) => {
    setFormFields({
      ...formFields,
      enddate: dateToString(dateSelected),
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
    if (formFields.teacherid === 0) {
      props.setMessageText(`Validation: Course must have a teacher.`);
      return;
    }
    if (Date.parse(formFields.startdate) > Date.parse(formFields.enddate)) {
      props.setMessageText(`Validation: Start date cannot be after end date.`);
      return;
    }
    props.onFormSubmit(formFields);
    if (courseId === 0) {
      setFormFields(emptyForm);
    }
    props.history.goBack();
  };

  // render teacher
  const renderTeacher = () => {
    let allTeachers = [];
    if (courseId === 0) {
      allTeachers.push(
        <option value={0} key={0}>
          0 - Not Selected
        </option>
      );
    }
    props.personList.forEach((person) => {
      if (person.isteacher) {
        if (person.id === formFields.teacherid) {
          allTeachers.push(
            <option selected value={person.id} key={person.id}>
              {person.id} - {person.personname}
            </option>
          );
        } else {
          allTeachers.push(
            <option value={person.id} key={person.id}>
              {person.id} - {person.personname}
            </option>
          );
        }
      }
    });
    return allTeachers;
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h3>Course Form</h3>
        <form onSubmit={onSubmit}>
          <Table hover>
            <tbody>
              <tr>
                <td>Course Id</td>
                <td>{formFields.id === 0 ? `New` : formFields.id}</td>
              </tr>
              <tr>
                <td>Teacher</td>
                <td>
                  <select
                    name="teacherid"
                    value={formFields.teacherid}
                    onChange={onFieldChange}
                  >
                    {renderTeacher()};
                  </select>
                </td>
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
                  <input
                    name="description"
                    onChange={onFieldChange}
                    value={formFields.description}
                    placeholder="description"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>Start Date</td>
                <td>
                  <DatePicker
                    selected={Date.parse(formFields.startdate)}
                    onChange={onStartDateChange}
                  />
                </td>
              </tr>
              <tr>
                <td>End Date</td>
                <td>
                  <DatePicker
                    selected={Date.parse(formFields.enddate)}
                    onChange={onEndDateChange}
                  />
                </td>
              </tr>
              <tr>
                <td>Passing Grade</td>
                <td>
                  <input
                    name="passgrade"
                    onChange={onFieldChange}
                    value={formFields.passgrade}
                    placeholder="passing grade"
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          <div>
            <Button type="submit" variant="primary">
              <Icon iconType="add" /> {courseId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/course`}>
              <Button variant="primary">
                <Icon iconType="back" /> Course List
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
CourseForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default CourseForm;
