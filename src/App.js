import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
// import Nav from "react-bootstrap/Nav";
// import Alert from "react-bootstrap/Alert";

import "./App.css";
import Home from "./components/Home";
import Course from "./components/Course";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";

const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// App component
const App = () => {
  // console.log(`App, will initialize`);
  // Declare and initialize state
  const [courseList, setCourseList] = useState([]);
  const [personList, setPersonList] = useState([]);

  // use hook/state for proper error handling
  const [errorMessage, setErrorMessage] = useState(null);

  // uses API to get all courses
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/course")
      .then((response) => {
        // const apiCourseList = response.data;
        setCourseList(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  // uses API to get all persons
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/person")
      .then((response) => {
        // const apiPersonList = response.data;
        setPersonList(response.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  // callback function for person form
  const onPersonFormSubmit = (formFields) => {
    // prepare params
    const params = {
      // headers: {
      //   "Content-Type": "application/json",
      //   "Access-Control-Allow-Origin": "*",
      // },
      id: 5,
      email: formFields.email,
      password: formFields.password,
      personname: formFields.personname,
      isadmin: formFields.isadmin,
      isteacher: formFields.isteacher,
      isstudent: formFields.isstudent,
    };
    // add person
    axios
      .post(API_URL_BASE + `/person/5`, params)
      .then((response) => {
        // console.log(`Checkout success`, response.data);
        setErrorMessage(`Person was added.`);
      })
      .catch((error) => {
        // console.log(`Checkout failure`, error.message);
        setErrorMessage(error.message);
      });
  };

  const renderNav = () => {
    // console.log(`App, render navigation`);
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Navbar.Brand>AWSchool</Navbar.Brand>
        <ul className="navbar-nav">
          <Link to="/">
            <li className="nav-item">Home</li>
          </Link>
          <Link to="/course">
            <li className="nav-item">Course</li>
          </Link>
          <Link to="/person">
            <li className="nav-item">Person</li>
          </Link>
          <Link to="/personform">
            <li className="nav-item">Add Person</li>
          </Link>
        </ul>
      </Navbar>
    );
  };

  const renderMessage = () => {
    if (errorMessage) {
      return <p>Message: {errorMessage}</p>;
    } else {
      return <div></div>;
    }
  };

  const renderFooter = () => {
    return (
      <footer>
        <div className="padded-container"></div>
        <div className="copyright">
          <p>Copyright © 2020 Suely Barreto Ada-C13. All rights reserved. </p>
        </div>
      </footer>
    );
  };

  return (
    <Router>
      <div className="AppRoute">
        {renderNav()}
        {renderMessage()}
        {renderFooter()}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/course"
            render={(props) => <Course {...props} courseList={courseList} />}
          />
          <Route
            path="/person"
            render={(props) => <Person {...props} personList={personList} />}
          />
          <Route
            path="/personform"
            render={(props) => (
              <PersonForm {...props} onFormSubmit={onPersonFormSubmit} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
