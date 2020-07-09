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
import TeacherCourse from "./components/TeacherCourse";
import TeacherEnrollment from "./components/TeacherEnrollment";
// import { id } from "date-fns/locale";

// Base URL for AWS API Gateway
const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

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

  // API call to get
  const getTable = (tableName, setTable, sortBy, setMessage) => {
    axios
      .get(API_URL_BASE + `/${tableName}`)
      .then((response) => {
        setTable(sortBy(response.data));
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  // API call to get all persons
  useEffect(() => {
    getTable("person", setPersonList, sortById, setMessageText);
  }, [personUpdate]);

  // API call to get all courses
  useEffect(() => {
    getTable("course", setCourseList, sortById, setMessageText);
  }, [courseUpdate]);

  // API call to get enrollment (coursestudent)
  useEffect(() => {
    getTable(
      "coursestudent",
      setEnrollmentList,
      sortByStudentId,
      setMessageText
    );
  }, [enrollmentUpdate]);

  // API call to get all assignments
  useEffect(() => {
    getTable("assignment", setAssignmentList, sortById, setMessageText);
  }, [assignmentUpdate]);

  // API call to get all answers (assignmentstudents)
  useEffect(() => {
    getTable(
      "assignmentstudent",
      setAnswerList,
      sortByStudentId,
      setMessageText
    );
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

  // API call to post
  const postTable = (
    tableName,
    messageName,
    id,
    params,
    setUpdate,
    getUpdate,
    setMessage
  ) => {
    setMessage(id === 0 ? `Adding...` : `Updating...`);

    // API call to add or update table
    axios
      .post(API_URL_BASE + `/${tableName}/${id}`, params)
      .then((response) => {
        setUpdate(getUpdate + 1);
        setMessage(
          id === 0
            ? `Success: ${messageName} added.`
            : `Success: ${messageName} updated.`
        );
      })
      .catch((error) => {
        setMessageText(`Error: ${error.message}`);
      });
  };

  // callback to add or update person form
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

    // API call to add or update person
    postTable(
      "person",
      "Person",
      formFields.id,
      params,
      setPersonUpdate,
      personUpdate,
      setMessageText
    );
  };

  // callback to add or update course form
  const onCourseFormSubmit = (formFields) => {
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
    postTable(
      "course",
      "Course",
      formFields.id,
      params,
      setCourseUpdate,
      courseUpdate,
      setMessageText
    );
  };

  // callback to add or update enrollment form
  const onEnrollmentFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      studentid: parseInt(formFields.studentid),
      averagegrade: parseFloat(formFields.averagegrade),
    };

    // API call to add or update enrollment (coursestudent)
    postTable(
      "coursestudent",
      "Enrollment",
      formFields.id,
      params,
      setEnrollmentUpdate,
      enrollmentUpdate,
      setMessageText
    );
  };

  // callback to add or update assignment form
  const onAssignmentFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      title: formFields.title,
      description: formFields.description,
      duedate: formFields.duedate,
    };

    // API call to add or update assignment
    postTable(
      "assignment",
      "Assignment",
      formFields.id,
      params,
      setAssignmentUpdate,
      assignmentUpdate,
      setMessageText
    );
  };

  // callback to add or update answer form
  const onAnswerFormSubmit = (formFields) => {
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
    postTable(
      "assignmentstudent",
      "Answer",
      formFields.id,
      params,
      setAnswerUpdate,
      answerUpdate,
      setMessageText
    );
  };

  // API call to delete
  const tableDelete = (
    tableName,
    messageName,
    id,
    setUpdate,
    getUpdate,
    setMessage
  ) => {
    setMessage(`Deleting...`);

    // TODO API call to delete a table item ???
    axios
      .delete(API_URL_BASE + `/${tableName}/${id}`)
      .then((response) => {
        setUpdate(getUpdate + 1);
        setMessage(`Success: ${messageName} deleted.`);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  // callback to delete person
  const onPersonDelete = (id) => {
    tableDelete(
      "person",
      "Person",
      id,
      setPersonUpdate,
      personUpdate,
      setMessageText
    );
  };

  // callback to delete course
  const onCourseDelete = (id) => {
    tableDelete(
      "course",
      "Course",
      id,
      setCourseUpdate,
      courseUpdate,
      setMessageText
    );
  };

  // callback to delete enrollment (coursestudent)
  const onEnrollmentDelete = (id) => {
    tableDelete(
      "coursestudent",
      "Enrollment",
      id,
      setEnrollmentUpdate,
      enrollmentUpdate,
      setMessageText
    );
  };

  // callback to delete assignment
  const onAssignmentDelete = (id) => {
    tableDelete(
      "assignment",
      "Assignment",
      id,
      setAssignmentUpdate,
      assignmentUpdate,
      setMessageText
    );
  };

  // callback to delete answer
  const onAnswerDelete = (id) => {
    tableDelete(
      "assignmentstudent",
      "Answer",
      id,
      setAnswerUpdate,
      answerUpdate,
      setMessageText
    );
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
          <Link to="/person">
            <li className="nav-item">Person</li>
          </Link>
          <Link to="/course">
            <li className="nav-item">Course</li>
          </Link>
          <Link to="/teachercourse">
            <li className="nav-item">Teacher</li>
          </Link>
        </ul>
        {renderUser()}
      </Navbar>
    );
  };

  // message flashes for 3 seconds
  useEffect(() => {
    if (!messageText) {
      return;
    }

    const timer = setTimeout(() => setMessageText(""), 3000);
    return () => clearTimeout(timer);
  }, [messageText]);

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
              setMessageText={setMessageText}
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
              setMessageText={setMessageText}
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
              setMessageText={setMessageText}
            />
          )}
        />
        <Route
          path="/teachercourse"
          render={(props) => (
            <TeacherCourse
              {...props}
              currentUser={currentUser}
              courseList={courseList}
            />
          )}
        />
        <Route
          path="/teacherenrollment/:courseid"
          render={(props) => (
            <TeacherEnrollment
              {...props}
              currentUser={currentUser}
              enrollmentList={enrollmentList}
              courseList={courseList}
              personList={personList}
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
