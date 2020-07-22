import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import Icon from "./Icon";
import axios from "axios";
import "./Components.css";

// Base URL for AWS API Gateway
const API_URL_BASE =
  "https://4jqwh1vygi.execute-api.us-west-2.amazonaws.com/prod";

// Log Component
const Log = (props) => {
  const [logList, setLogList] = useState([]);
  const [logSort, setLogSort] = useState("id");

  // get adminId from currentUser
  const adminId = props.currentUser
    ? props.currentUser.isadmin
      ? props.currentUser.id
      : 0
    : 0;

  // sort by column
  const sortBy = (objs, column) => {
    return objs.sort((a, b) =>
      a[column] > b[column] ? 1 : b[column] > a[column] ? -1 : 0
    );
  };

  // AWS API Gateway GET call to each table
  const getTable = (tableName, setTable, sortColumn, setMessage) => {
    axios
      .get(API_URL_BASE + `/${tableName}`)
      .then((response) => {
        setTable(sortBy(response.data, sortColumn));
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  // AWS API Gateway call to GET all logs
  useEffect(() => {
    getTable("log", setLogList, logSort, props.setMessageText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logSort]);

  // return person id and name
  const renderPerson = (personid) => {
    const person = props.personList.find((person) => person.id === personid);
    return person ? `${person.id} - ${person.personname}` : `${personid} - N/A`;
  };

  // shows sort button with the right icon
  const renderSortButton = (column) => {
    const iconType = column === logSort ? "sort1" : "sort2";
    return (
      <span
        onClick={() => {
          setLogSort(column);
        }}
      >
        <Icon iconType={iconType} />
      </span>
    );
  };

  // render log
  const renderLog = () => {
    return logList.map((log) => {
      return (
        <tr key={log.id}>
          <td>{log.id}</td>
          <td>{renderPerson(log.personid)}</td>
          <td>{log.timestamp.replace(`T`, ` `)}</td>
          <td>{log.action}</td>
          <td>{log.table}</td>
          <td>
            <div className="action-content">
              {JSON.stringify(log.before, null, ` `)}
            </div>
          </td>
          <td>
            <div className="action-content">
              {JSON.stringify(log.after, null, ` `)}
            </div>
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
        <h1>Log</h1>
        <div>
          <Table hover>
            <thead>
              <tr>
                <th>
                  Id &nbsp;
                  {renderSortButton("id")}
                </th>
                <th>
                  Person &nbsp;
                  {renderSortButton("personid")}
                </th>
                <th>
                  Timestamp &nbsp;
                  {renderSortButton("timestamp")}
                </th>
                <th>
                  Action &nbsp;
                  {renderSortButton("action")}
                </th>
                <th>
                  Table &nbsp;
                  {renderSortButton("table")}
                </th>
                <th>
                  Before &nbsp;
                  {renderSortButton("before")}
                </th>
                <th>
                  After &nbsp;
                  {renderSortButton("after")}
                </th>
              </tr>
            </thead>
            <tbody>{renderLog()}</tbody>
          </Table>
        </div>
      </div>
    );
  }
};

// define prop types
Log.propTypes = {
  currentUser: PropTypes.object.isRequired,
  personList: PropTypes.array.isRequired,
  setMessageText: PropTypes.func.isRequired,
};

export default Log;
