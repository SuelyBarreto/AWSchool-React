import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import "./Components.css";

// Assignment Component
const Assignment = (props) => {
  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // get id from route parameter :id
  const courseId = parseInt(props.match.params.courseid);

  // return course id and title
  const renderCourse = () => {
    const course = props.courseList.find((course) => course.id === courseId);
    return course ? `${course.id} - ${course.title}` : `${courseId} - N/A`;
  };

  //
  const renderSortButton = (column) => {
    const iconType = column === props.assignmentSort ? "sort1" : "sort2";
    return (
      <span
        onClick={() => {
          props.setAssignmentSort(column);
        }}
      >
        <Icon iconType={iconType} />
      </span>
    );
  };

  // render assignment
  const renderAssignment = (assignmentList) => {
    return assignmentList
      .filter((assignment) => assignment.courseid === courseId)
      .map((assignment) => {
        return (
          <tr key={assignment.id}>
            <td>{assignment.id}</td>
            <td>{assignment.title}</td>
            <td>{assignment.description}</td>
            <td>{assignment.duedate}</td>
            <td>
              <Link to={`/answer/${courseId}/${assignment.id}`}>
                <Button variant="primary">
                  <Icon iconType="answer" />
                </Button>
              </Link>
              &nbsp;
              <Link to={`/assignmentform/${courseId}/${assignment.id}`}>
                <Button variant="primary">
                  <Icon iconType="edit" />
                </Button>
              </Link>
              &nbsp;
              <Button
                variant="primary"
                onClick={() => {
                  if (window.confirm("Confirm delete?")) {
                    props.onAssignmentDelete(assignment.id);
                  }
                }}
              >
                <Icon iconType="delete" />
              </Button>
            </td>
          </tr>
        );
      });
  };

  // check if current user is admin
  if (adminId === 0) {
    return <h3>Requires Administrator Login</h3>;
  } else {
    // render main form
    return (
      <div>
        <h1>Assignments: Course {renderCourse()}</h1>
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>
                  Id &nbsp;
                  {renderSortButton("id")}
                </th>
                <th>
                  Title &nbsp;
                  {renderSortButton("title")}
                </th>
                <th>
                  Description &nbsp;
                  {renderSortButton("description")}
                </th>
                <th>
                  Due Date &nbsp;
                  {renderSortButton("duedate")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderAssignment(props.assignmentList)}</tbody>
          </Table>
          <p>
            <Link to={`/assignmentform/${courseId}/0`}>
              <Button variant="primary">
                <Icon iconType="add" /> Add New
              </Button>
            </Link>
            &nbsp;
            <Link to={`/course`}>
              <Button variant="primary">
                <Icon iconType="back" /> Course List
              </Button>
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

// define prop types
Assignment.propTypes = {
  currentUser: PropTypes.object.isRequired,
  courseList: PropTypes.array.isRequired,
  assignmentList: PropTypes.array.isRequired,
  onAssignmentDelete: PropTypes.func.isRequired,
  assignmentSort: PropTypes.string.isRequired,
  setAssignmentSort: PropTypes.func.isRequired,
};

export default Assignment;
