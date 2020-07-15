import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import sha256 from "js-sha256";
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
import TeacherAssignment from "./components/TeacherAssignment";
import TeacherAssignmentForm from "./components/TeacherAssignmentForm";
import TeacherAnswer from "./components/TeacherAnswer";
import TeacherAnswerForm from "./components/TeacherAnswerForm";
import StudentCourse from "./components/StudentCourse";
import StudentAssignment from "./components/StudentAssignment";
import StudentAnswerForm from "./components/StudentAnswerForm";

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

  // AWS API Gateway GET call
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

  // AWS API Gateway call to GET all persons
  useEffect(() => {
    getTable("person", setPersonList, sortById, setMessageText);
  }, [personUpdate]);

  // AWS API Gateway call to GET all courses
  useEffect(() => {
    getTable("course", setCourseList, sortById, setMessageText);
  }, [courseUpdate]);

  // AWS API Gateway call to GET enrollment (CourseStudent)
  useEffect(() => {
    getTable(
      "coursestudent",
      setEnrollmentList,
      sortByStudentId,
      setMessageText
    );
  }, [enrollmentUpdate]);

  // AWS API Gateway call to GET all assignments
  useEffect(() => {
    getTable("assignment", setAssignmentList, sortById, setMessageText);
  }, [assignmentUpdate]);

  // AWS API Gateway call to GET all answers (AssignmentStudents)
  useEffect(() => {
    getTable(
      "assignmentstudent",
      setAnswerList,
      sortByStudentId,
      setMessageText
    );
  }, [answerUpdate]);

  // Callback to Login
  const onLogin = (formFields) => {
    let user = null;
    personList.forEach((person) => {
      if (
        person.email === formFields.email &&
        person.password === sha256(formFields.password + formFields.email)
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

  // AWS API Gateway POST call
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

    // AWS API Gateway POST call to add/update a table
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

  // Callback to add/update PersonForm
  const onPersonFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      email: formFields.email,
      password: sha256(formFields.password + formFields.email),
      personname: formFields.personname,
      isadmin: formFields.isadmin,
      isteacher: formFields.isteacher,
      isstudent: formFields.isstudent,
    };
    console.log(params);

    // AWS API Gateway POST call to add/update Person
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

  // Callback to add/update CourseForm
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

    // AWS API Gateway POST call to add/update Course
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

  // Callback to add/update EnrollmentForm
  const onEnrollmentFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      studentid: parseInt(formFields.studentid),
      averagegrade: parseFloat(formFields.averagegrade),
    };

    // AWS API Gateway POST call to add/update Enrollment (CourseStudent)
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

  // Callback to add/update AssignmentForm
  const onAssignmentFormSubmit = (formFields) => {
    // prepare params
    const params = {
      id: formFields.id,
      courseid: parseInt(formFields.courseid),
      title: formFields.title,
      description: formFields.description,
      duedate: formFields.duedate,
    };

    // AWS API Gateway POST call to add/update Assignment
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

  // Callback to add/update AnswerForm
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

    // AWS API Gateway POST call to add/update Answer (AssignmentStudent)
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

  // AWS API Gateway DELETE call
  const tableDelete = (
    tableName,
    messageName,
    id,
    setUpdate,
    getUpdate,
    setMessage
  ) => {
    setMessage(`Deleting...`);

    // AWS API Gateway call to DELETE a table item
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

  // callback to DELETE person
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

  // callback to DELETE course
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

  // callback to DELETE enrollment (CourseStudent)
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

  // callback to DELETE assignment
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

  // callback to DELETE answer
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

  // Nav - render links for each role
  const renderLinks = () => {
    let allLinks = [];
    allLinks.push(
      <Link to="/" key="1">
        <li className="nav-item">Home</li>
      </Link>
    );
    if (currentUser) {
      if (currentUser.isadmin) {
        allLinks.push(
          <Link to="/person" key="2">
            <li className="nav-item">Person</li>
          </Link>
        );
        allLinks.push(
          <Link to="/course" key="3">
            <li className="nav-item">All Courses</li>
          </Link>
        );
      }
      if (currentUser.isteacher) {
        allLinks.push(
          <Link to="/teachercourse" key="4">
            <li className="nav-item">Teacher Courses</li>
          </Link>
        );
      }
      if (currentUser.isstudent) {
        allLinks.push(
          <Link to="/studentcourse" key="5">
            <li className="nav-item">Student Courses</li>
          </Link>
        );
      }
    }
    return allLinks;
  };

  // Nav - render navigation bar
  const renderNavBar = () => {
    return (
      <Navbar fixed="top" bg="dark" variant="dark">
        <Navbar.Brand>AWSchool</Navbar.Brand>
        <ul className="navbar-nav mr-auto">{renderLinks()}</ul>
        {renderUser()}
      </Navbar>
    );
  };

  // message "flashes" for 3 seconds
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
      return <p>&nbsp;</p>;
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
              currentUser={currentUser}
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
              currentUser={currentUser}
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
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              onCourseDelete={onCourseDelete}
            />
          )}
        />
        <Route
          path="/courseform/:courseid"
          render={(props) => (
            <CourseForm
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
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
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
              onEnrollmentDelete={onEnrollmentDelete}
            />
          )}
        />
        <Route
          path="/enrollmentform/:courseid/:enrollmentid"
          render={(props) => (
            <EnrollmentForm
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
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
              currentUser={currentUser}
              courseList={courseList}
              assignmentList={assignmentList}
              onAssignmentDelete={onAssignmentDelete}
            />
          )}
        />
        <Route
          path="/assignmentform/:courseid/:assignmentid"
          render={(props) => (
            <AssignmentForm
              {...props}
              currentUser={currentUser}
              courseList={courseList}
              assignmentList={assignmentList}
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
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              assignmentList={assignmentList}
              answerList={answerList}
              onAnswerDelete={onAnswerDelete}
            />
          )}
        />
        <Route
          path="/answerform/:courseid/:assignmentid/:answerid"
          render={(props) => (
            <AnswerForm
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
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
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
            />
          )}
        />
        <Route
          path="/teacherassignment/:courseid"
          render={(props) => (
            <TeacherAssignment
              {...props}
              currentUser={currentUser}
              courseList={courseList}
              assignmentList={assignmentList}
              onAssignmentDelete={onAssignmentDelete}
            />
          )}
        />
        <Route
          path="/teacherassignmentform/:courseid/:assignmentid"
          render={(props) => (
            <TeacherAssignmentForm
              {...props}
              currentUser={currentUser}
              courseList={courseList}
              assignmentList={assignmentList}
              onFormSubmit={onAssignmentFormSubmit}
              setMessageText={setMessageText}
            />
          )}
        />
        <Route
          path="/teacheranswer/:courseid/:assignmentid"
          render={(props) => (
            <TeacherAnswer
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              assignmentList={assignmentList}
              answerList={answerList}
              onAnswerDelete={onAnswerDelete}
            />
          )}
        />
        <Route
          path="/teacheranswerform/:courseid/:assignmentid/:answerid"
          render={(props) => (
            <TeacherAnswerForm
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
              onFormSubmit={onAnswerFormSubmit}
              setMessageText={setMessageText}
            />
          )}
        />
        <Route
          path="/studentcourse"
          render={(props) => (
            <StudentCourse
              {...props}
              currentUser={currentUser}
              personList={personList}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
            />
          )}
        />
        <Route
          path="/studentassignment/:courseid"
          render={(props) => (
            <StudentAssignment
              {...props}
              currentUser={currentUser}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
            />
          )}
        />
        <Route
          path="/studentanswerform/:courseid/:assignmentid/:answerid"
          render={(props) => (
            <StudentAnswerForm
              {...props}
              currentUser={currentUser}
              courseList={courseList}
              enrollmentList={enrollmentList}
              assignmentList={assignmentList}
              answerList={answerList}
              onFormSubmit={onAnswerFormSubmit}
              setMessageText={setMessageText}
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
