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
import Assignment from "./components/Assignment";
import AssignmentStudent from "./components/AssignmentStudent";
import CourseStudent from "./components/CourseStudent";

const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// App component
const App = () => {
  // Declare and initialize state
  const [courseList, setCourseList] = useState([]);
  const [courseUpdate, setCourseUpdate] = useState(0);
  const [personList, setPersonList] = useState([]);
  const [personUpdate, setPersonUpdate] = useState(0);
  const [assignmentList, setAssignmentList] = useState([]);
  const [assignmentStudentList, setAssignmentStudentList] = useState([]);
  const [courseStudentList, setCourseStudentList] = useState([]);

  // hook/state for proper error handling
  const [messageText, setMessageText] = useState(null);

  // API to get all courses
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/course")
      .then((response) => {
        setCourseList(response.data);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [courseUpdate]);

  // API to get all persons
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/person")
      .then((response) => {
        setPersonList(response.data);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [personUpdate]);

  // API to get assignments
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/assignment")
      .then((response) => {
        setAssignmentList(response.data);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, []);

  // API to get student assignment
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/assignmentstudent")
      .then((response) => {
        setAssignmentStudentList(response.data);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, []);

  // API to get student course
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/coursestudent")
      .then((response) => {
        setCourseStudentList(response.data);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, []);

  // callback function for person form
  const onPersonFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      email: formFields.email,
      password: formFields.password,
      personname: formFields.personname,
      isadmin: formFields.isadmin,
      isteacher: formFields.isteacher,
      isstudent: formFields.isstudent,
    };

    // add person
    axios
      .post(API_URL_BASE + `/person/${formFields.id}`, params)
      .then((response) => {
        // console.log(`Checkout success`, response.data);
        setPersonUpdate(personUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Person added.`
            : `Success: Person updaded.`
        );
      })
      .catch((error) => {
        // console.log(`Checkout failure`, error.message);
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback function to delete person
  const onPersonDelete = (id) => {
    // delete person
    axios
      .delete(API_URL_BASE + `/person/${id}`)
      .then((response) => {
        // console.log(`Checkout success`, response.data);
        setPersonUpdate(personUpdate + 1);
        setMessageText(`Success: Person deleted.`);
      })
      .catch((error) => {
        // console.log(`Checkout failure`, error.message);
        setMessageText(`Error: ${error.message}`);
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
        </ul>
      </Navbar>
    );
  };

  const renderMessage = () => {
    if (messageText) {
      return <p>{messageText}</p>;
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
            render={(props) => (
              <Person
                {...props}
                personList={personList}
                onPersonDelete={onPersonDelete}
              />
            )}
          />
          <Route
            path="/personform/:id"
            render={(props) => (
              <PersonForm
                {...props}
                personList={personList}
                onFormSubmit={onPersonFormSubmit}
              />
            )}
          />
          <Route
            path="/assignment"
            render={(props) => (
              <Assignment {...props} assignmentList={assignmentList} />
            )}
          />
          <Route
            path="/assignmentstudent"
            render={(props) => (
              <AssignmentStudent
                {...props}
                assignmentStudentList={assignmentStudentList}
              />
            )}
          />
          <Route
            path="/coursestudent"
            render={(props) => (
              <CourseStudent {...props} courseStudentList={courseStudentList} />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
