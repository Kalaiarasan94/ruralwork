// PRODUCTION: Replace with your Hostinger domain URL
// export const BASE_URL = 'https://yourdomain.com/vbg-backend/api';

// DEVELOPMENT: Your local IP address
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://rural.nexoraapp.in/api';

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login.php`,
  GET_ATTENDANCE: `${BASE_URL}/get_attendance.php`,
  GET_GRIEVANCES: `${BASE_URL}/get_grievances.php`,
  LODGE_GRIEVANCE: `${BASE_URL}/lodge_grievance.php`,
  REGISTER_SUPERVISOR: `${BASE_URL}/register_supervisor.php`,
  REGISTER_WORKER: `${BASE_URL}/register_worker.php`,
  SAVE_BATCH_ATTENDANCE: `${BASE_URL}/save_batch_attendance.php`,
  DASHBOARD: `${BASE_URL}/dashboard.php`,
  VERIFY_WORKER: `${BASE_URL}/verify_worker.php`,
};
