"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const {
    id,
    teacherid,
    title,
    description,
    startdate,
    enddate,
    passgrade,
  } = JSON.parse(event.body);

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "Course",
    };

    try {
      const existingData = await documentClient.scan(scanParams).promise();
      existingData.Items.forEach((item) => {
        if (item.id > calculatedId) {
          calculatedId = item.id;
        }
      });
    } catch (err) {
      responseBody = `Unable to get course: ${err}`;
      statusCode = 403;
    }
    calculatedId++;
  } else {
    calculatedId = id;
  }

  // if course doesn't have a teacher id, return error
  if (!teacherid || teacherid === 0) {
    responseBody = `Course must have a teacher`;
    statusCode = 400;
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

  // if startdate or enddate is blank, return error
  if (!startdate || !enddate) {
    responseBody = `Course must have a start date and an end date`;
    statusCode = 400;
  }

  // if end date is not on or after the start date, return error
  if (Date.parse(startdate) > Date.parse(enddate)) {
    responseBody = `Course end date must be on or after the start date`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const putParams = {
      TableName: "Course",
      Item: {
        id: calculatedId,
        teacherid: teacherid,
        title: title,
        description: description,
        startdate: startdate,
        enddate: enddate,
        passgrade: passgrade,
      },
    };

    try {
      const data = await documentClient.put(putParams).promise();
      responseBody = JSON.stringify(data);
      statusCode = 201;
    } catch (err) {
      responseBody = `Unable to put course: ${err}`;
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
