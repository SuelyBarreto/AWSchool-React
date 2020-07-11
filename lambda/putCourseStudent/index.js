"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const { id, courseid, studentid, averagegrade } = JSON.parse(event.body);

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "CourseStudent",
    };

    try {
      const existingData = await documentClient.scan(scanParams).promise();
      existingData.Items.forEach((item) => {
        if (item.id > calculatedId) {
          calculatedId = item.id;
        }
      });
    } catch (err) {
      responseBody = `Unable to get student course: ${err}`;
      statusCode = 403;
    }
    calculatedId++;
  } else {
    calculatedId = id;
  }

  // if courseid is blank, return error
  if (!courseid) {
    responseBody = `Course must have a course ID`;
    statusCode = 400;
  }

  // if studentid is blank, return error
  if (!studentid) {
    responseBody = `Course must have a student ID`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const params = {
      TableName: "CourseStudent",
      Item: {
        id: calculatedId,
        courseid: courseid,
        studentid: studentid,
        averagegrade: averagegrade,
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
