"use strict";
const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const { id, personid, timestamp, action, table, before, after } = JSON.parse(
    event.body
  );

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "Log",
    };

    try {
      const existingData = await documentClient.scan(scanParams).promise();
      existingData.Items.forEach((item) => {
        if (item.id > calculatedId) {
          calculatedId = item.id;
        }
      });
    } catch (err) {
      responseBody = `Unable to get log: ${err}`;
      statusCode = 403;
    }
    calculatedId++;
  } else {
    calculatedId = id;
  }

  // if log doesn't have a person id, return error
  if (!personid || personid === 0) {
    responseBody = `Log must have a person`;
    statusCode = 400;
  }

  // if timestamp is blank, return error
  if (!timestamp) {
    responseBody = `Log must have a timestamp`;
    statusCode = 400;
  }

  // if action is blank, return error
  if (!action) {
    responseBody = `Log must have an action`;
    statusCode = 400;
  }

  // if table is blank, return error
  if (!table) {
    responseBody = `Log must have a table`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const putParams = {
      TableName: "Log",
      Item: {
        id: calculatedId,
        personid: personid,
        timestamp: timestamp,
        action: action,
        table: table,
        before: before,
        after: after,
      },
    };

    try {
      const data = await documentClient.put(putParams).promise();
      responseBody = JSON.stringify(data);
      statusCode = 201;
    } catch (err) {
      responseBody = `Unable to put log: ${err}`;
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
