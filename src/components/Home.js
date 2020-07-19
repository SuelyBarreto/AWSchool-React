import React from "react";
import PropTypes from "prop-types";
import Image from "react-bootstrap/Image";
import "./Components.css";
// TODO
// Home Component
const Home = (props) => {
  const renderAdminDashboard = () => {
    const adminCount = props.personList.filter((person) => person.isadmin)
      .length;
    const teacherCount = props.personList.filter((person) => person.isteacher)
      .length;
    const studentCount = props.personList.filter((person) => person.isstudent)
      .length;
    const courseCount = props.courseList.length;
    return (
      <div className="homediv">
        <h3 className="homeh3">Administrator Information</h3>
        <p className="homep">Administrators: {adminCount}</p>
        <p className="homep">Teachers: {teacherCount}</p>
        <p className="homep">Students: {studentCount}</p>
        <p className="homep">Courses: {courseCount}</p>
      </div>
    );
  };

  const renderTeacherDashboard = () => {
    const teacherCourse = props.courseList.filter(
      (course) => course.teacherid === props.currentUser.id
    ); // what are the courses for this teacher

    const courseCount = teacherCourse.length;
    let studentCount = 0;
    teacherCourse.forEach((course) => {
      studentCount += props.enrollmentList.filter(
        (enroll) => enroll.courseid === course.id
      ).length;
    }); // on the enrollment list, for the courses selected, sum the students count

    let teacherAssignment = [];
    teacherCourse.forEach((course) => {
      props.assignmentList
        .filter((assign) => assign.courseid === course.id)
        .forEach((assign) => {
          teacherAssignment.push(assign);
        }); // get the list of assignments for that teacher
    });
    const assignmentCount = teacherAssignment.length;

    let toGradeCount = 0;
    teacherAssignment.forEach((assign) => {
      toGradeCount += props.answerList.filter(
        (answer) => answer.assignmentid === assign.id && !answer.dategraded
      ).length;
    }); // on the answer list, for the assignments selected, sum the answers to grade

    return (
      <div className="homediv">
        <h3 className="homeh3">Teacher Information</h3>
        <p className="homep">Courses: {courseCount}</p>
        <p className="homep">Students: {studentCount}</p>
        <p className="homep">Assignments: {assignmentCount}</p>
        <p className="homep">Answers to Grade: {toGradeCount}</p>
      </div>
    );
  };

  // return true if student is enrolled in a course
  const enrolledInCourse = (courseId) => {
    const enrolled = props.enrollmentList.find(
      (enrollment) =>
        enrollment.courseid === courseId &&
        enrollment.studentid === props.currentUser.id
    );
    return enrolled;
  };

  const renderStudentDashboard = () => {
    const studentCourse = props.courseList.filter((course) =>
      enrolledInCourse(course.id)
    ); // what are the courses for this student

    const courseCount = studentCourse.length;

    let studentAssignment = [];
    studentCourse.forEach((course) => {
      props.assignmentList
        .filter((assign) => assign.courseid === course.id)
        .forEach((assign) => {
          studentAssignment.push(assign);
        }); // get the list of assignments for that student
    });
    const assignmentCount = studentAssignment.length;

    const answerCount = props.answerList.filter(
      (answer) => answer.studentid === props.currentUser.id
    ).length; // number of answers for a student

    const toAnswerCount = assignmentCount - answerCount;

    return (
      <div className="homediv">
        <h3 className="homeh3">Student Information</h3>
        <p className="homep">Courses: {courseCount}</p>
        <p className="homep">Assignments: {assignmentCount}</p>
        <p className="homep">Answers: {answerCount}</p>
        <p className="homep">Answers Pending: {toAnswerCount}</p>
      </div>
    );
  };

  const renderDashboard = () => {
    let allDashboards = [];
    if (props.currentUser) {
      if (props.currentUser.isadmin) {
        allDashboards.push(renderAdminDashboard());
      }
      if (props.currentUser.isteacher) {
        allDashboards.push(renderTeacherDashboard());
      }
      if (props.currentUser.isstudent) {
        allDashboards.push(renderStudentDashboard());
      }
    }
    return allDashboards;
  };

  return (
    <section className="home">
      <div className="title">
        <h1>Welcome to AWSchool - Learn and Be Curious</h1>
      </div>
      <div className="container">
        <span className="containerright">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Universidade_Federal_do_Cear%C3%A1.png/1920px-Universidade_Federal_do_Cear%C3%A1.png"
            alt="School Picture"
            fluid
            className="splash"
          ></Image>
        </span>
        <span className="containerleft">{renderDashboard()}</span>
      </div>
    </section>
  );
};

// define prop types
Home.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  courseList: PropTypes.array.isRequired,
  enrollmentList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  answerList: PropTypes.array.isRequired,
};

export default Home;
