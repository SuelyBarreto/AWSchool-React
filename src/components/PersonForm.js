import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// define PersonForm component
const PersonForm = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // define emptyForm
  const emptyForm = {
    id: 0,
    email: "",
    password: "",
    password2: "",
    personname: "",
    isadmin: false,
    isteacher: false,
    isstudent: false,
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // get id from route parameter :personid
  const personId = parseInt(props.match.params.personid);

  // find data for current id, put in formFields
  useEffect(() => {
    if (personId !== 0) {
      props.personList.forEach((person) => {
        if (person.id === personId) {
          setFormFields({
            id: person.id,
            email: person.email,
            password: "",
            password2: "",
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

    if (!formFields.personname) {
      props.setMessageText(`Validation: Name cannot be blank.`);
      return;
    }
    if (!formFields.email) {
      props.setMessageText(`Validation: Email cannot be blank.`);
      return;
    }

    if (
      props.personList.find(
        (person) =>
          person.email === formFields.email && person.id !== formFields.id
      )
    ) {
      props.setMessageText(`Validation: Email already in use.`);
      return;
    }

    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!regex.test(formFields.password)) {
      props.setMessageText(
        `Validation: Password must be have at least: 8 characters, 1 number, 1 lower case, 1 upper case and 1 special character.`
      );
      return;
    }

    if (formFields.password !== formFields.password2) {
      props.setMessageText(`Validation: Passwords must match.`);
      return;
    }
    if (!(formFields.isteacher || formFields.isstudent || formFields.isadmin)) {
      props.setMessageText(
        `Validation: Person must be an admin, a teacher or a student.`
      );
      return;
    }
    props.onFormSubmit(formFields);
    if (personId === 0) {
      setFormFields(emptyForm);
    }
    props.history.goBack();
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
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
                    type="password"
                  />
                </td>
              </tr>
              <tr>
                <td>Retype Password</td>
                <td>
                  <input
                    name="password2"
                    onChange={onFieldChange}
                    value={formFields.password2}
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
              <Icon iconType="add" />
              {personId === 0 ? "Add" : "Save"}
            </Button>
            &nbsp;
            <Link to={`/person`}>
              <Button variant="primary">
                <Icon iconType="back" /> Person List t
              </Button>
            </Link>
          </div>
        </form>
      </div>
    );
  }
};

// define prop types
PersonForm.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default PersonForm;
