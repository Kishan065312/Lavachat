import client from '../api/axiosClient';

const apiService = {
    get: async (endpoint, params = {}) => {
        try {
            const response = await client.get(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error(`GET ${endpoint} Error:`, error);
            throw error;
        }
    },

    post: async (endpoint, body = {}, config = {}) => {
        try {
            const response = await client.post(endpoint, body, config);
            return response.data;
        } catch (error) {
            console.error(`POST ${endpoint} Error:`, error);
            throw error;
        }
    },

    put: async (endpoint, body = {}, config = {}) => {
        try {
            const response = await client.put(endpoint, body, config);
            return response.data;
        } catch (error) {
            console.error(`PUT ${endpoint} Error:`, error);
            throw error;
        }
    },

    delete: async (endpoint, config = {}) => {
        try {
            const response = await client.delete(endpoint, config);
            return response.data;
        } catch (error) {
            console.error(`DELETE ${endpoint} Error:`, error);
            throw error;
        }
    },
};

export default apiService;
