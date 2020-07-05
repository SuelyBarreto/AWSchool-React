import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

const renderPerson = (personList, onPersonDelete) => {
  return personList.map((person, index) => {
    return (
      <tr key={index}>
        <td>{person.id}</td>
        <td>{person.personname}</td>
        <td>{person.email}</td>
        <td>{person.isadmin ? `yes` : ``}</td>
        <td>{person.isteacher ? `yes` : ``}</td>
        <td>{person.isstudent ? `yes` : ``}</td>
        <td>
          <Link to={`/personform/${person.id}`}>
            <Button variant="primary">Edit</Button>
          </Link>
          &nbsp;
          <Button
            variant="primary"
            onClick={() => {
              onPersonDelete(person.id);
            }}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  });
};

// Person Component
const Person = (props) => {
  return (
    <div>
      <h1>Person</h1>
      <div className="personlistlist">
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
          <tbody>{renderPerson(props.personList, props.onPersonDelete)}</tbody>
        </Table>
        <p>
          <Link to="/personform/0">
            <Button variant="primary">Add New</Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

Person.propTypes = {
  personList: PropTypes.array.isRequired,
  onPersonDelete: PropTypes.func.isRequired,
};

export default Person;
