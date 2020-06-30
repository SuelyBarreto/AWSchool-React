import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./PersonForm.css";

// define PersonForm component
const PersonForm = (props) => {
  // define emptyForm
  const emptyForm = {
    email: "",
    password: "",
    personname: "",
    isadmin: "",
    isteacher: "",
    isstudent: "",
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

  // event when a form field is changed
  const onFieldChange = (event) => {
    // console.log(`${event.target.name} Field updated ${event.target.value}`);
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

  // event for submit button
  const onSubmit = (event) => {
    event.preventDefault();
    // console.log(`Form submitted`, formFields);
    props.onFormSubmit(formFields);
    setFormFields(emptyForm);
  };

  // main form
  return (
    <div className="Form">
      <h3>Person Form</h3>
      <form className="Form__form" onSubmit={onSubmit}>
        <Table hover>
          <tbody>
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
                  value={formFields.isadmin}
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
                  value={formFields.isteacher}
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
                  value={formFields.isstudent}
                  type="checkbox"
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="Form__submit">
          <input type="submit" value="Submit" className="primary" />
        </div>
      </form>
    </div>
  );
};

PersonForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};

export default PersonForm;
