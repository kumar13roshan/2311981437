import axios from 'axios';

const LOG_API_URL =
  import.meta.env.VITE_LOG_API_URL || 'http://20.207.122.201/evaluation-service/logs';
const LOG_ACCESS_TOKEN = import.meta.env.VITE_LOG_ACCESS_TOKEN;

export async function Log(stack, level, pkg, message) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (LOG_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${LOG_ACCESS_TOKEN}`;
    }

    await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      { headers, timeout: 3000 }
    );
  } catch (error) {
    console.error('Frontend logging failed:', error.response?.data || error.message);
  }
}

