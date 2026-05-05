const axios = require('axios');
const { Log } = require('./logger');

const EVALUATION_BASE_URL =
  process.env.EVALUATION_BASE_URL || 'http://20.207.122.201/evaluation-service';

async function registerClient({ email, name, mobileNo, githubUsername, rollNo, accessCode }) {
  try {
    const response = await axios.post(
      `${EVALUATION_BASE_URL}/register`,
      {
        email,
        name,
        mobileNo,
        githubUsername,
        rollNo,
        accessCode,
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    await Log('backend', 'info', 'auth', 'client registered successfully');
    return response.data;
  } catch (error) {
    await Log('backend', 'error', 'auth', `client registration failed: ${error.message}`);
    throw error;
  }
}

async function authenticateClient({ email, name, rollNo, accessCode, clientID, clientSecret }) {
  try {
    const response = await axios.post(
      `${EVALUATION_BASE_URL}/auth`,
      {
        email,
        name,
        rollNo,
        accessCode,
        clientID,
        clientSecret,
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    await Log('backend', 'info', 'auth', 'client authenticated successfully');
    return response.data;
  } catch (error) {
    await Log('backend', 'error', 'auth', `client authentication failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  registerClient,
  authenticateClient,
};

