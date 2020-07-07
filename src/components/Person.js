import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import "./Components.css";

// Person component
const Person = (props) => {
  // render person
  const renderPerson = () => {
    return props.personList.map((person) => {
      return (
        <tr key={person.id}>
          <td>{person.id}</td>
          <td>{person.personname}</td>
          <td>{person.email}</td>
          <td className="yesno">{person.isadmin ? `yes` : ``}</td>
          <td className="yesno">{person.isteacher ? `yes` : ``}</td>
          <td className="yesno">{person.isstudent ? `yes` : ``}</td>
          <td>
            <Link to={`/personform/${person.id}`}>
              <Button variant="primary">Edit</Button>
            </Link>
            &nbsp;
            <Button
              variant="primary"
              onClick={() => {
                props.onPersonDelete(person.id);
              }}
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    });
  };

  // render main form
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
              <th className="yesno">Administrator</th>
              <th className="yesno">Teacher</th>
              <th className="yesno">Student</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{renderPerson()}</tbody>
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

// define prop types
Person.propTypes = {
  personList: PropTypes.array.isRequired,
  onPersonDelete: PropTypes.func.isRequired,
};

export default Person;
