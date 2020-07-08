import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
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
import Answer from "./components/Answer";
import AnswerForm from "./components/AnswerForm";

// Base URL for AWS API Gateway
const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// App component
const App = () => {
  // state for tables
  const [personList, setPersonList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [enrollmentList, setEnrollmentList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [answerList, setAnswerList] = useState([]);

  // state to signal table changes
  const [personUpdate, setPersonUpdate] = useState(0);
  const [courseUpdate, setCourseUpdate] = useState(0);
  const [enrollmentUpdate, setEnrollmentUpdate] = useState(0);
  const [assignmentUpdate, setAssignmentUpdate] = useState(0);
  const [answerUpdate, setAnswerUpdate] = useState(0);

  // state for messages and logged in user
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

  // API call to get all persons
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

  // API call to get all courses
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

  // API call to get enrollment (coursestudent)
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

  // API call to get all assignments
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

  // API call to get all answers (assignmentstudents)
  useEffect(() => {
    axios
      .get(API_URL_BASE + "/assignmentstudent")
      .then((response) => {
        setAnswerList(sortByStudentId(response.data));
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  }, [answerUpdate]);

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

    // API call to add or update person
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

    // API call to add or update course
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

    // API call to add or update enrollment (coursestudent)
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

  // callback to add or update assignment form
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

    // API call to add or update assignment
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

  // callback to add or update answer form
  const onAnswerFormSubmit = (formFields) => {
    setMessageText(formFields.id === 0 ? `Adding...` : `Updating...`);

    // prepare params
    const params = {
      id: formFields.id,
      assignmentid: parseInt(formFields.assignmentid),
      studentid: parseInt(formFields.studentid),
      answer: formFields.answer,
      dateanswered: formFields.dateanswered,
      grade: parseFloat(formFields.grade),
      dategraded: formFields.dategraded,
    };

    // API call to add or update answer (assignmentstudent)
    axios
      .post(API_URL_BASE + `/assignmentstudent/${formFields.id}`, params)
      .then((response) => {
        setAnswerUpdate(answerUpdate + 1);
        setMessageText(
          formFields.id === 0
            ? `Success: Answer added.`
            : `Success: Answer updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to delete person
  const onPersonDelete = (id) => {
    setMessageText(`Deleting...`);

    // API call to delete
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

    // API call to delete
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

    // API call to delete
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

    // API call to delete
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

  // callback to delete answer
  const onAnswerDelete = (id) => {
    setMessageText(`Deleting...`);

    // API call to delete
    axios
      .delete(API_URL_BASE + `/assignmentstudent/${id}`)
      .then((response) => {
        setAnswerUpdate(answerUpdate + 1);
        setMessageText(`Success: Answer deleted.`);
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // Nav - show current user email if logged in
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

  // Nav - render Navigation bar
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
          path="/login"
          render={(props) => <Login {...props} onLogin={onLogin} />}
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
          path="/personform/:personid"
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
          path="/courseform/:courseid"
          render={(props) => (
            <CourseForm
              {...props}
              courseList={courseList}
              personList={personList}
              onFormSubmit={onCourseFormSubmit}
              setMessageText={setMessageText}
            />
          )}
        />
        <Route
          path="/enrollment/:courseid"
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
          path="/enrollmentform/:courseid/:enrollmentid"
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
          path="/assignment/:courseid"
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
          path="/assignmentform/:courseid/:assignmentid"
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
          path="/answer/:courseid/:assignmentid"
          render={(props) => (
            <Answer
              {...props}
              answerList={answerList}
              assignmentList={assignmentList}
              courseList={courseList}
              personList={personList}
              onAnswerDelete={onAnswerDelete}
            />
          )}
        />
        <Route
          path="/answerform/:courseid/:assignmentid/:answerid"
          render={(props) => (
            <AnswerForm
              {...props}
              answerList={answerList}
              assignmentList={assignmentList}
              enrollmentList={enrollmentList}
              courseList={courseList}
              personList={personList}
              onFormSubmit={onAnswerFormSubmit}
            />
          )}
        />
      </Switch>
    );
  };

  // render only login page until user logs in
  const renderLoginOrRoutes = () => {
    if (currentUser) {
      return renderAllRoutes();
    } else {
      return <Login onLogin={onLogin} />;
    }
  };

  // render main Router
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
