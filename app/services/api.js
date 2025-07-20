const BASE_URL = 'http://192.168.1.118:3000/api';

export const loginUser = async (email, password) => {
  const payload = {
    email_id: email,
    password: password,
  };

  console.log("Sending payload:", payload);

  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log("Response status:", response.status);
  console.log("Raw response from server:", text);

  if (!response.ok) {
    throw new Error(text || 'Login failed');
  }

  return JSON.parse(text);
};


