"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const {
    id,
    assignmentid,
    studentid,
    answer,
    dateanswered,
    grade,
    dategraded,
  } = JSON.parse(event.body);

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "AssignmentStudent",
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

  // if assignment id  is blank, return error
  if (!assignmentid) {
    responseBody = `Assignment must have an assignment ID`;
    statusCode = 400;
  }

  // if student id is blank, return error
  if (!studentid) {
    responseBody = `Assignment must have an student ID`;
    statusCode = 400;
  }

  // if answer is blank, return error
  if (!answer) {
    responseBody = `Assignment must have an answer`;
    statusCode = 400;
  }

  // if no date answered, return error
  if (!dateanswered) {
    responseBody = `Answer must have a date answered`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const params = {
      TableName: "AssignmentStudent",
      Item: {
        id: calculatedId,
        assignmentid: assignmentid,
        studentid: studentid,
        answer: answer,
        dateanswered: dateanswered,
        grade: grade,
        dategraded: dategraded,
      },
    };

    try {
      const data = await documentClient.put(params).promise();
      responseBody = JSON.stringify(data);
      statusCode = 201;
    } catch (err) {
      responseBody = `Unable to add: ${err}`;
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
