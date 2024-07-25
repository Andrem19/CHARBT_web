import axios from 'axios';
import { API_URL, PUB_URL } from '../config';
import { apiRequest } from '../services/services'

export async function registerUser(username, email, password, ref) {
  try {
      const response = await axios.post(`${PUB_URL}/register`, {
          username,
          email,
          password,
          ref,
      });

      if (response.status === 201) {
          return true;
      } else {
          console.warn(`Registration failed: ${response.status}`);
          return false;
      }
  } catch (error) {
      console.error('Error during registration:', error);
      return false;
  }
}

export async function checkUserExist(email) {
    try {
      const response = await axios.post(`${PUB_URL}/user_exists`, { email });
      if (response.status === 200) {
        return response.data.exist;
      } else {
        console.warn(`User not found: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Error while checking user existence:', error);
      return false;
    }
  }

  // Функция для отправки запроса на сброс пароля
  export async function requestResetPassword(email) {
    try {
      const response = await axios.post(`${PUB_URL}/request_reset_password`, { email });
      return response.data;
    } catch (error) {
      console.error('Error during the password reset request:', error);
      return null;
    }
  }
  
  // Функция для сброса пароля
  export async function resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${PUB_URL}/reset_password`, { token, new_password: newPassword });
      return response.data;
    } catch (error) {
      console.error('Error during the password reset:', error);
      return null;
    }
  }
  
  export const changeName = async (navigate, id, new_name) => {
    try {
        const data = { id: id, new_name: new_name };
        const response = await apiRequest(navigate, 'POST', '/change_name', data);
        
        if (response) {
            return response.data.message;
        } else {
            return 'No response received from the server.';
        }
    } catch (error) {
        return 'Error in setting up the request.';
    }
};

  
  
export const uploadAvatar = async (navigate, formData) => {
  try {
      const headers = { 'Content-Type': 'multipart/form-data' };
      const response = await apiRequest(navigate, 'POST', '/set_avatar', formData, headers);
      
      if (response) {
          return response.data.message;
      } else {
          return 'No response received from the server.';
      }
  } catch (error) {
      return 'Error in setting up the request.';
  }
};

export async function deleteAvatar(navigate) {
  try {
      const response = await apiRequest(navigate, 'DELETE', '/delete_avatar');
      
      if (response) {
          return response.data.message;
      } else {
          return 'No response received from the server.';
      }
  } catch (error) {
      return 'Error in setting up the request.';
  }
};


  

  export async function deleteUser(navigate) {
    try {
        const response = await apiRequest(navigate, 'DELETE', '/delete_user');
        return response.data.message;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else if (error.request) {
        return 'No response received from the server.';
      } else {
        return 'Error in setting up the request.';
      }
    }
}

export async function changeEmail(navigate, password, newEmail) {
  try {
    const data = {
      password,
      new_email: newEmail
      }
      const response = await apiRequest(navigate, 'POST', '/change_email', data);
      return response.data.message;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data.message);
      return error.response.data.message;
    } else if (error.request) {
      console.error('No response received from the server.');
      return 'No response received from the server.';
    } else {
      console.error('Error in setting up the request:', error.message);
      return 'Error in setting up the request.';
    }
  }
}

export async function changePassword(navigate, currentPassword, newPassword) {
  try {
    const data = {
      current_password: currentPassword,
      new_password: newPassword
      }
      const response = await apiRequest(navigate, 'POST', '/change_password', data);
      return response.data.message;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data.message);
      return error.response.data.message;
    } else if (error.request) {
      console.error('No response received from the server.');
      return 'No response received from the server.';
    } else {
      console.error('Error in setting up the request:', error.message);
      return 'Error in setting up the request.';
    }
  }
}

export async function changeSettings(navigate, data) {
  try {
      const response = await apiRequest(navigate, 'POST', '/set_settings', data);
      return response.data.message;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data.message);
      return error.response.data.message;
    } else if (error.request) {
      console.error('No response received from the server.');
      return 'No response received from the server.';
    } else {
      console.error('Error in setting up the request:', error.message);
      return 'Error in setting up the request.';
    }
  }
}
export const createTicket = async (navigate, subject, message) => {
  try {
    const data = { subject: subject, message: message }
    const response = await apiRequest(navigate, 'POST', '/create_ticket', data);
    return response.data.message;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else if (error.request) {
      return 'No response received from the server.';
    } else {
      return 'Error in setting up the request.';
    }
  }
};
