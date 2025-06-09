const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005';

export const API_ENDPOINTS = {
  // Units endpoints
  UNITS: {
    GET_ALL: `${API_BASE_URL}/units/all`,
    GET_SINGLE: `${API_BASE_URL}/units/single`,
    CREATE: `${API_BASE_URL}/units/create`,
    UPDATE: `${API_BASE_URL}/units/update`,
    DELETE: `${API_BASE_URL}/units/delete`,
  },
}