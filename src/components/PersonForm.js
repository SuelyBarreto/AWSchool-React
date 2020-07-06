import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// define PersonForm component
const PersonForm = (props) => {
  // define emptyForm
  const emptyForm = {
    id: 0,
    email: "",
    password: "",
    personname: "",
    isadmin: false,
    isteacher: false,
    isstudent: false,
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);
  // get id from route parameter :id
  // const [personId, setCurrentId] = useState(parseInt(props.match.params.id));
  const personId = parseInt(props.match.params.personid);

  // find data for current id, put in formFields
  useEffect(() => {
    if (personId !== 0) {
      props.personList.forEach((person) => {
        if (person.id === personId) {
          setFormFields({
            id: person.id,
            email: person.email,
            password: person.password,
            personname: person.personname,
            isadmin: person.isadmin,
            isteacher: person.isteacher,
            isstudent: person.isstudent,
          });
        }
      });
    }
  }, [personId, props.personList]);

  // event when form field changes
  const onFieldChange = (event) => {
    let newValue =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormFields({
      ...formFields,
      [event.target.name]: newValue,
    });
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();
    if (!(formFields.isteacher || formFields.isstudent || formFields.isadmin)) {
      props.setMessageText(
        `Validation: person must be an admin, a teacher or a student`
      );
      return;
    }
    props.onFormSubmit(formFields);
    if (personId === 0) {
      setFormFields(emptyForm);
    }
  };

  // main form
  return (
    <div>
      <h3>Person Form</h3>
      <form onSubmit={onSubmit}>
        <Table hover>
          <tbody>
            <tr>
              <td>Person Id</td>
              <td>{formFields.id === 0 ? `New` : formFields.id}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>
                <input
                  name="email"
                  onChange={onFieldChange}
                  value={formFields.email}
                  placeholder="email"
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>Password</td>
              <td>
                <input
                  name="password"
                  onChange={onFieldChange}
                  value={formFields.password}
                  placeholder="password"
                  type="password"
                />
              </td>
            </tr>
            <tr>
              <td>Name</td>
              <td>
                <input
                  name="personname"
                  onChange={onFieldChange}
                  value={formFields.personname}
                  placeholder="name"
                  type="text"
                />
              </td>
            </tr>
            <tr>
              <td>Administrator</td>
              <td>
                <input
                  name="isadmin"
                  onChange={onFieldChange}
                  checked={formFields.isadmin}
                  type="checkbox"
                />
              </td>
            </tr>
            <tr>
              <td>Teacher</td>
              <td>
                <input
                  name="isteacher"
                  onChange={onFieldChange}
                  checked={formFields.isteacher}
                  type="checkbox"
                />
              </td>
            </tr>
            <tr>
              <td>Student</td>
              <td>
                <input
                  name="isstudent"
                  onChange={onFieldChange}
                  checked={formFields.isstudent}
                  type="checkbox"
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <div>
          <Button type="submit" variant="primary">
            {personId === 0 ? "Add" : "Save"}
          </Button>
          &nbsp;
          <Link to={`/person`}>
            <Button variant="primary">Person List</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

PersonForm.propTypes = {
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default PersonForm;
