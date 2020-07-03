import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
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
  const currentId = parseInt(props.match.params.id);

  // find data for current id, put in formFields
  useEffect(() => {
    if (currentId !== 0) {
      props.courseList.forEach((course) => {
        if (course.id === currentId) {
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
  }, [currentId, props.courseList]);

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
    if (currentId === 0) {
      setFormFields(emptyForm);
    }
  };

  const renderTeacher = (person) => {
    let allTeachers = [];
    props.personList.forEach((person) => {
      if (person.isteacher) {
        if (person.id === formFields.teacherid) {
          allTeachers.push(
            <option selected value={person.id}>
              {person.id} - {person.personname}
            </option>
          );
        } else {
          allTeachers.push(
            <option value={person.id}>
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
                  type="title"
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
                <input
                  name="startdate"
                  onChange={onFieldChange}
                  value={formFields.startdate}
                  placeholder="start date"
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>End Date</td>
              <td>
                <input
                  name="enddate"
                  onChange={onFieldChange}
                  value={formFields.enddate}
                  placeholder="end date"
                  type="text"
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
            {currentId === 0 ? "Add" : "Save"}
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
