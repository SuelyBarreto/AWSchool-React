import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CourseForm.css";

// define CourseForm component
const CourseForm = (props) => {
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
  // get id from route parameter :id
  const courseId = parseInt(props.match.params.id);

  // find data for current id, put in formFields
  useEffect(() => {
    if (courseId !== 0) {
      props.courseList.forEach((course) => {
        if (course.id === courseId) {
          setFormFields({
            id: course.id,
            teacherid: course.teacherid,
            title: course.title,
            description: course.description,
            startdate: course.startdate,
            enddate: course.enddate,
            passgrade: course.passgrade,
          });
        }
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
    const month = date.getMonth() + 1;
    const day = date.getDate();
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
    props.onFormSubmit(formFields);
    if (courseId === 0) {
      setFormFields(emptyForm);
    }
  };

  const renderTeacher = (person) => {
    let allTeachers = [];
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

  // main form
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
                <select name="teacherid" onChange={onFieldChange}>
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
            {courseId === 0 ? "Add" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

CourseForm.propTypes = {
  courseList: PropTypes.array.isRequired,
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default CourseForm;
