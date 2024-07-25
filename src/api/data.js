import axios from 'axios';
import { API_URL, PUB_URL } from '../config';
import { apiRequest } from '../services/services'


export async function uploadScreenshot(navigate, screenshot, name) {
    try {
        let dataUrl = screenshot.toDataURL();
        let response = await fetch(dataUrl);
        let blob = await response.blob();

        let formData = new FormData();
        formData.append('file', blob, `${name}.png`);

        const headers = { 'Content-Type': 'multipart/form-data' };
        const uploadResponse = await apiRequest(navigate, 'POST', '/upload_screenshot', formData, headers);
        
        if (uploadResponse) {
            return uploadResponse.data.file_url;
        } else {
            console.error('Error uploading screenshot');
            return null;
        }
    } catch (error) {
        console.error('Error in uploadScreenshot:', error);
        throw error;
    }
};

export async function addPosition(navigate, session_id, position) {
    try {
        const url = `/add_position/${session_id}`;
        const method = 'POST';
        const data = { position: position };

        const response = await apiRequest(navigate, method, url, data);
        if (response.status === 200) {
            return { 'status': true, 'id': response.data.position_id }
        } else {
            return { 'status': false, 'message': response.data.message }
        }
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

export async function getScreenshots(navigate) {
    try {
        const response = await apiRequest(navigate, 'GET', '/get_screenshots');
        
        if (response && response.data.result) {
            return response.data.urls;
        } else {
            console.error('Error getting screenshots');
            return [];
        }
    } catch (error) {
        console.error('Error in getScreenshots:', error);
        return [];
    }
};

export async function getPositionHistory(navigate, position_id) {
    try {
        const response = await apiRequest(navigate, 'GET', '/get_position_data', {}, {}, { 'position_id': position_id });
        
        if (response.status === 200) {
            const data = response.data.data.map(candle => ({
                time: new Date(new Date(candle[0]).toISOString()).valueOf() / 1000,
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }));
            return { 'status': true, 'data': data }
        } else {
            console.error('Error getting screenshots');
            return { 'status': false, 'message': response.data.message }
        }
    } catch (error) {
        console.error('Error in getScreenshots:', error);
        return { 'status': false, 'message': `Error: ${error}` }
    }
};


export async function deleteScreenshot(navigate, fileUrl) {
    try {
        const data = { file_url: fileUrl };
        const response = await apiRequest(navigate, 'DELETE', '/delete_screenshot', data);
        
        if (response) {
            return true;
        } else {
            console.error('Error deleting screenshot');
            return false;
        }
    } catch (error) {
        console.error('Error in deleteScreenshot:', error);
        throw error;
    }
};

export async function createSession(navigate, sessionName, coin_pair, timeframe) {
    try {
        const data = { name: sessionName, coin_pair: coin_pair, timeframe: timeframe };
        const response = await apiRequest(navigate, 'POST', '/add_session', data);
        
        if (response && response.status === 201) {
            return {result: true, session: response.data.session};
        } else {
            return { result: false };
        }
    } catch (error) {
        console.error('An error occurred while sending the request:', error);
    }
};



export async function getSession(navigate, sessionId) {
    try {
        const response = await apiRequest(navigate, 'GET', `/session/${sessionId}`);
        
        if (response) {
            return response.data;
        } else {
            console.error('Error getting the session');
            return false;
        }
    } catch (error) {
        console.error('Error in getSession:', error);
        return false;
    }
};

export async function deleteSession(navigate, sessionId) {
    try {
        const response = await apiRequest(navigate, 'DELETE', `/session/${sessionId}`);
        
        if (response) {
            return response.status === 200;
        } else {
            console.error('Error deleting the session');
            return false;
        }
    } catch (error) {
        console.error('Error in deleteSession:', error);
        return false;
    }
};

export async function getText(name_id) {
    try {
        const response = await axios.get(`${PUB_URL}/get_text`, {
            params: {
                name_id: name_id
            }
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            console.error(`Error with status code ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getGSettings() {
    try {
        const response = await axios.get(`${PUB_URL}/get_global_settings`);

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Error with status code ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getBlog(navigate, type) {
    try {
        let url = PUB_URL;
        let headers = {};

        if (type === 'api') {
            url = API_URL;
            const token = localStorage.getItem('jwt'); // Получаем токен из localStorage
            if (!token) {
                navigate('/login')
            }
            headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовки запроса
        }

        const response = await fetch(`${url}/blog_posts`, { headers });

        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            console.error(`Error with status code ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}


export async function voteOnPoll(navigate, postId, optionId) {
    try {
        const data = {
            postId,
            optionId
        };

        const response = await apiRequest(navigate, 'POST', '/vote', data);

        if (response && response.status === 200) {
            return response.data;
        } else {
            console.error(`Error with status code ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
}

