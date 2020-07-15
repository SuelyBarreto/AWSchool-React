import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Person component
const Person = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  const renderCheck = (isChecked) => {
    if (isChecked) {
      return <Icon iconType="check" />;
    } else {
      return <span></span>;
    }
  };

  // render person
  const renderPerson = () => {
    return props.personList.map((person) => {
      return (
        <tr key={person.id}>
          <td>{person.id}</td>
          <td>{person.personname}</td>
          <td>{person.email}</td>
          <td>{renderCheck(person.isadmin)}</td>
          <td>{renderCheck(person.isteacher)}</td>
          <td>{renderCheck(person.isstudent)}</td>
          <td>
            <Link to={`/personform/${person.id}`}>
              <Button variant="primary">
                <Icon iconType="edit" />
              </Button>
            </Link>
            &nbsp;
            <Button
              variant="primary"
              onClick={() => {
                if (window.confirm("Confirm delete?")) {
                  props.onPersonDelete(person.id);
                }
              }}
            >
              <Icon iconType="delete" />
            </Button>
          </td>
        </tr>
      );
    });
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Person</h1>
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Administrator</th>
                <th>Teacher</th>
                <th>Student</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderPerson()}</tbody>
          </Table>
          <p>
            <Link to="/personform/0">
              <Button variant="primary">
                <Icon iconType="add" /> Add New
              </Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
Person.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  onPersonDelete: PropTypes.func.isRequired,
};

export default Person;
