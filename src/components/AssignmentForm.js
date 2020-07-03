import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./AssignmentForm.css";

// define AssignmentForm component
const AssignmentForm = (props) => {
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
      props.assignmentList.forEach((assignment) => {
        if (assignment.id === currentId) {
          setFormFields({
            id: assignment.id,
            teacherid: assignment.teacherid,
            title: assignment.title,
            description: assignment.description,
            startdate: assignment.startdate,
            enddate: assignment.enddate,
            passgrade: assignment.passgrade,
          });
        }
      });
    }
  }, [currentId, props.assignmentList]);

  // event when form field changes
  const onFieldChange = (event) => {
    if (typeof formFields[event.target.name] === "number") {
      const newValue = parseFloat(event.target.value);
      console.log(
        ` Form target:`,
        event.target.name,
        ` Form string value:`,
        event.target.value,
        ` New value:`,
        newValue
      );
      if (!isNaN(newValue)) {
        setFormFields({
          ...formFields,
          [event.target.name]: newValue,
        });
      }
    } else {
      setFormFields({
        ...formFields,
        [event.target.name]: event.target.value,
      });
    }
    console.log(formFields);
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit(formFields);
    if (currentId === 0) {
      setFormFields(emptyForm);
    }
  };

  // main form
  return (
    <div>
      <h3>Course Form</h3>
      <form onSubmit={onSubmit}>
        <Table hover>
          <tbody>
            <tr>
              <td>Id</td>
              <td>{formFields.id === 0 ? `New` : formFields.id}</td>
            </tr>
            <tr>
              <td>Teacher</td>
              <td>
                <input
                  name="teacherid"
                  onChange={onFieldChange}
                  value={formFields.teacherid}
                  placeholder="teacherid"
                  type="text"
                />
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

AssignmentForm.propTypes = {
  assignmentList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default AssignmentForm;
