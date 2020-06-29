// import React, { Component } from "react";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";

import "./App.css";
import Home from "./components/Home";
import Course from "./components/Course";
import Person from "./components/Person";

const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// App component
const App = () => {
  console.log(`App, will initialize`);
  // Declare and initialize state
  const [courseList, setCourseList] = useState([]);
  const [personList, setPersonList] = useState([]);

  // use hook/state for proper error handling
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL_BASE + "/course")
      .then((response) => {
        const apiCourseList = response.data;
        console.log(`apicourseList success`);
        setCourseList(apiCourseList);
      })
      .catch((error) => {
        console.log(`apicourseList error`, error.message);
        setErrorMessage(error.message);
      });

    axios
      .get(API_URL_BASE + "/person")
      .then((response) => {
        const apiPersonList = response.data;
        setPersonList(apiPersonList);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  const renderNav = () => {
    console.log(`App, render navigation`);
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
        </ul>
      </Navbar>
    );
  };

  const renderFooter = () => {
    return (
      <footer>
        <div class="padded-container"></div>
        <div class="copyright">
          <p>Copyright © 2020 Suely Barreto Ada-C13. All rights reserved. </p>
        </div>
      </footer>
    );
  };

  return (
    <Router>
      <div className="AppRoute">
        {renderNav()}
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
        </Switch>
      </div>
    </Router>
  );
};

export default App;
