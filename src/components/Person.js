import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import "./Person.css";

const renderPerson = (personList) => {
  return personList.map((person, index) => {
    return (
      <tr key={index}>
        <td>{person.personname}</td>
        <td>{person.email}</td>
        <td>{person.isadmin}</td>
        <td>{person.isteacher}</td>
        <td>{person.isstudent}</td>
        <td>
          <Button variant="primary">Edit</Button>
        </td>
        <td>
          <Button variant="primary">Delete</Button>
        </td>
      </tr>
    );
  });
};

// Person Component
const Person = (props) => {
  console.log(`rendering persons...`, props);
  return (
    <div>
      <h1>Person</h1>
      <div className="personlistlist">
        <Table hover>
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Administrator</td>
              <td>Teacher</td>
              <td>Student</td>
              <td>Select</td>
            </tr>
          </thead>
          <tbody>{renderPerson(props.personList)}</tbody>
        </Table>
        <td>
          <Button variant="primary">Add Person</Button>
        </td>
      </div>
    </div>
  );
};

Person.propTypes = {
  personList: PropTypes.array.isRequired,
};

export default Person;
