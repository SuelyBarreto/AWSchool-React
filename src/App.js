import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
// import Button from "react-bootstrap/Button";
// import Nav from "react-bootstrap/Nav";
// import Alert from "react-bootstrap/Alert";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Course from "./components/Course";
import CourseForm from "./components/CourseForm";
import Enrollment from "./components/Enrollment";
import EnrollmentForm from "./components/EnrollmentForm";
import Assignment from "./components/Assignment";
import AssignmentForm from "./components/AssignmentForm";
import AssignmentStudent from "./components/AssignmentStudent";

const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// App component
const App = () => {
  // Declare and initialize state
  const [personList, setPersonList] = useState([]);
  const [personUpdate, setPersonUpdate] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [courseUpdate, setCourseUpdate] = useState(0);
  const [enrollmentList, setEnrollmentList] = useState([]);
  const [enrollmentUpdate, setEnrollmentUpdate] = useState(0);
  const [assignmentList, setAssignmentList] = useState([]);
  const [assignmentUpdate, setAssignmentUpdate] = useState(0);
  const [assignmentStudentList, setAssignmentStudentList] = useState([]);
  const [messageText, setMessageText] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // sort by id
  const sortById = (objs) => {
    return objs.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
  };

  // sort by student id
  const sortByStudentId = (objs) => {
    return objs.sort((a, b) =>
      a.studentid > b.studentid ? 1 : b.studentid > a.studentid ? -1 : 0
    );
  };

  // API to get all persons
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/person")
      .then((response) => {
        setPersonList(sortById(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [personUpdate]);

  // API to get all courses
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/course")
      .then((response) => {
        setCourseList(sortById(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [courseUpdate]);

  // API to get enrollment (coursestudent)
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/coursestudent")
      .then((response) => {
        setEnrollmentList(sortByStudentId(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [enrollmentUpdate]);

  // API to get all assignments
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/assignment")
      .then((response) => {
        setAssignmentList(sortById(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [assignmentUpdate]);

  // API to get assignmentstudents
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/assignmentstudent")
      .then((response) => {
        setAssignmentStudentList(sortById(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, []);

  // callback to login
  const onLogin = (formFields) => {
    let user = null;
    personList.forEach((person) => {
      if (
        person.email === formFields.email &&
        person.password === formFields.password
      ) {
        user = person;
      }
    });

    if (user) {
      setCurrentUser(user);
      setMessageText(`Success: User logged in.`);
    } else {
      setMessageText(`Error: Invalid email or password.`);
    }
  };

  // callback to add or update person form
  const onPersonFormSubmit = (formFields) => {
    setMessageText(formFields.id === 0 ? `Adding...` : `Updating...`);

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

    // add or update person
    axios
      .post(API_URL_BASE + `/person/${formFields.id}`, params)
      .then((response) => {
        setPersonUpdate(personUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Person added.`
            : `Success: Person updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to add or update course form
  const onCourseFormSubmit = (formFields) => {
    setMessageText(formFields.id === 0 ? `Adding...` : `Updating...`);

    // prepare params
    const params = {
      id: formFields.id,
      teacherid: parseInt(formFields.teacherid),
      title: formFields.title,
      description: formFields.description,
      startdate: formFields.startdate,
      enddate: formFields.enddate,
      passgrade: parseFloat(formFields.passgrade),
    };

    // add or update course
    axios
      .post(API_URL_BASE + `/course/${formFields.id}`, params)
      .then((response) => {
        setCourseUpdate(courseUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Course added.`
            : `Success: Course updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to add or update enrollment form
  const onEnrollmentFormSubmit = (formFields) => {
    setMessageText(formFields.id === 0 ? `Adding...` : `Updating...`);

    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      studentid: parseInt(formFields.studentid),
      averagegrade: parseFloat(formFields.averagegrade),
    };

    // add or update enrollment (coursestudent)
    axios
      .post(API_URL_BASE + `/coursestudent/${formFields.id}`, params)
      .then((response) => {
        setEnrollmentUpdate(enrollmentUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Enrollment added.`
            : `Success: Enrollment updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to add or update enrollment form
  const onAssignmentFormSubmit = (formFields) => {
    setMessageText(formFields.id === 0 ? `Adding...` : `Updating...`);

    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      title: formFields.title,
      description: formFields.description,
      duedate: formFields.duedate,
    };

    // add or update enrollment (coursestudent)
    axios
      .post(API_URL_BASE + `/assignment/${formFields.id}`, params)
      .then((response) => {
        setAssignmentUpdate(assignmentUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Assignment added.`
            : `Success: Assignment updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to delete person
  const onPersonDelete = (id) => {
    setMessageText(`Deleting...`);
    axios
      .delete(API_URL_BASE + `/person/${id}`)
      .then((response) => {
        setPersonUpdate(personUpdate + 1);
        setMessageText(`Success: Person deleted.`);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to delete course
  const onCourseDelete = (id) => {
    setMessageText(`Deleting...`);
    axios
      .delete(API_URL_BASE + `/course/${id}`)
      .then((response) => {
        setCourseUpdate(courseUpdate + 1);
        setMessageText(`Success: Course deleted.`);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to delete enrollment (coursestudent)
  const onEnrollmentDelete = (id) => {
    setMessageText(`Deleting...`);
    axios
      .delete(API_URL_BASE + `/coursestudent/${id}`)
      .then((response) => {
        setEnrollmentUpdate(enrollmentUpdate + 1);
        setMessageText(`Success: Enrollment deleted.`);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to delete assignment
  const onAssignmentDelete = (id) => {
    setMessageText(`Deleting...`);
    axios
      .delete(API_URL_BASE + `/assignment/${id}`)
      .then((response) => {
        setAssignmentUpdate(assignmentUpdate + 1);
        setMessageText(`Success: Assignment deleted.`);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // show current user email if logged in
  const renderUser = () => {
    if (currentUser) {
      return (
        <ul className="navbar-nav">
          <li
            className="nav-item"
            onClick={() => {
              setCurrentUser(null);
            }}
          >
            Logout
          </li>
          <li className="nav-item">{currentUser.email}</li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">Not logged in</li>
        </ul>
      );
    }
  };

  // render Navigation bar
  const renderNavBar = () => {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Navbar.Brand>AWSchool</Navbar.Brand>
        <ul className="navbar-nav mr-auto">
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
        {renderUser()}
      </Navbar>
    );
  };

  // render message
  const renderMessage = () => {
    if (messageText) {
      return (
        <p
          onClick={() => {
            setMessageText("");
          }}
        >
          {messageText}
        </p>
      );
    } else {
      return <div></div>;
    }
  };

  // render footer
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

  // render all routes
  const renderAllRoutes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
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
              setMessageText={setMessageText}
            />
          )}
        />
        <Route
          path="/course"
          render={(props) => (
            <Course
              {...props}
              courseList={courseList}
              personList={personList}
              onCourseDelete={onCourseDelete}
            />
          )}
        />
        <Route
          path="/courseform/:id"
          render={(props) => (
            <CourseForm
              {...props}
              courseList={courseList}
              personList={personList}
              onFormSubmit={onCourseFormSubmit}
            />
          )}
        />
        <Route
          path="/enrollment/:id"
          render={(props) => (
            <Enrollment
              {...props}
              enrollmentList={enrollmentList}
              courseList={courseList}
              personList={personList}
              onEnrollmentDelete={onEnrollmentDelete}
            />
          )}
        />
        <Route
          path="/enrollmentform/:courseid/:id"
          render={(props) => (
            <EnrollmentForm
              {...props}
              enrollmentList={enrollmentList}
              courseList={courseList}
              personList={personList}
              onFormSubmit={onEnrollmentFormSubmit}
            />
          )}
        />
        <Route
          path="/assignment/:id"
          render={(props) => (
            <Assignment
              {...props}
              assignmentList={assignmentList}
              courseList={courseList}
              onAssignmentDelete={onAssignmentDelete}
            />
          )}
        />
        <Route
          path="/assignmentform/:courseid/:id"
          render={(props) => (
            <AssignmentForm
              {...props}
              assignmentList={assignmentList}
              courseList={courseList}
              onFormSubmit={onAssignmentFormSubmit}
            />
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
          path="/login"
          render={(props) => <Login {...props} onLogin={onLogin} />}
        />
      </Switch>
    );
  };

  // render only login page until logged in
  const renderLoginOrRoutes = () => {
    if (currentUser) {
      return renderAllRoutes();
    } else {
      return <Login onLogin={onLogin} />;
    }
  };

  //
  return (
    <Router>
      <div className="AppRoute">
        {renderNavBar()}
        {renderMessage()}
        {renderFooter()}
        {renderLoginOrRoutes()}
      </div>
    </Router>
  );
};

export default App;
