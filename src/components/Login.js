import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "./Components.css";

// define Login component
const Login = (props) => {
  // define emptyForm
  const emptyForm = {
    email: "",
    password: "",
  };

  // define formFields
  const [formFields, setFormFields] = useState(emptyForm);

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
    props.onLogin(formFields);
  };

  // main form
  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={onSubmit}>
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
          </tbody>
        </Table>
        <div>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
