"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const { id, courseid, title, description, duedate } = JSON.parse(event.body);

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "Assignment",
    };

    try {
      const existingData = await documentClient.scan(scanParams).promise();
      existingData.Items.forEach((item) => {
        if (item.id > calculatedId) {
          calculatedId = item.id;
        }
      });
    } catch (err) {
      responseBody = `Unable to get person: ${err}`;
      statusCode = 403;
    }
    calculatedId++;
  } else {
    calculatedId = id;
  }

  // if title is blank, return error
  if (!title) {
    responseBody = `Course must have a title`;
    statusCode = 400;
  }

  // if description is blank, return error
  if (!description) {
    responseBody = `Course must have a description`;
    statusCode = 400;
  }

  // if courseid is blank, return error
  if (!courseid) {
    responseBody = `Course must have a course ID`;
    statusCode = 400;
  }

  // if no dues date, return error
  if (!duedate) {
    responseBody = `Course must have a duedate`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const params = {
      TableName: "Assignment",
      Item: {
        id: calculatedId,
        courseid: courseid,
        title: title,
        description: description,
        duedate: duedate,
      },
    };

    try {
      const data = await documentClient.put(params).promise();
      responseBody = JSON.stringify(data);
      statusCode = 201;
    } catch (err) {
      responseBody = `Unable to add assignment: ${err}`;
      statusCode = 403;
    }
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "access-control-allow-origin": "*",
    },
    body: responseBody,
  };

  return response;
};
