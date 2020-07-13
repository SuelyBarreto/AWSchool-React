"use strict";

// pull main AWS library
const AWS = require("aws-sdk");

// signature for a Lambda function, handler function
exports.handler = async (event, context) => {
  // instanciating an instance of DocumentClient
  const documentClient = new AWS.DynamoDB.DocumentClient();

  let responseBody = "";
  let statusCode = 0;

  const {
    id,
    email,
    password,
    personname,
    isadmin,
    isteacher,
    isstudent,
  } = JSON.parse(event.body);

  // if id zero, finds next available id
  let calculatedId = 0;
  if (id === 0) {
    const scanParams = {
      TableName: "Person",
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

  // if email is blank, return error
  if (!email) {
    responseBody = `Email cannot be blank`;
    statusCode = 400;
  }

  // if perssonname is blank, return error
  if (!personname) {
    responseBody = `Person must have a name`;
    statusCode = 400;
  }

  // if password is not 64 characters (sha256 hash)
  if (password.length !== 64) {
    responseBody = `Password must be a sha256 hash`;
    statusCode = 400;
  }

  // if email is blank, return error
  if (!(isadmin || isteacher || isstudent)) {
    responseBody = `Person must be an administrator, a teacher, or a student`;
    statusCode = 400;
  }

  // creates putParams, updates DynamoDB
  if (statusCode === 0) {
    const putParams = {
      TableName: "Person",
      Item: {
        id: calculatedId,
        email: email,
        password: password,
        personname: personname,
        isadmin: isadmin,
        isteacher: isteacher,
        isstudent: isstudent,
      },
    };

    try {
      // put to add a new Person object to the database
      const data = await documentClient.put(putParams).promise();
      responseBody = JSON.stringify(data);
      statusCode = 201;
    } catch (err) {
      responseBody = `Unable to add/update person: ${err}`;
      statusCode = 403;
    }
  }

  const response = {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: responseBody,
  };

  return response;
};
