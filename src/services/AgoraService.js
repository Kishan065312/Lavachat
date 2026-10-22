import axios from 'axios';

const API_BASE_URL = 'https://landing.hostingsky.in';

class AgoraService {
  constructor() {
    this.appId = null;
    this.token = null;
    this.channelName = null;
    this.userId = null;
  }

  /**
   * Get Agora token from backend
   * @param {string} channelName - Room ID or channel name
   * @param {number} userId - User ID
   * @param {number} role - 0 for audience, 1 for host/broadcaster
   */
  async getToken(channelName, userId, role = 1) {
    try {
      const response = await axios.post(`${API_BASE_URL}/AgoraToken`, {
        channelName: channelName,
        userId: userId,
        role: role
      });

      if (response.data && response.data.token && response.data.appId) {
        this.appId = response.data.appId;
        this.token = response.data.token;
        this.channelName = channelName;
        this.userId = userId;
        
        console.log('✅ Agora Token Generated:', {
          appId: this.appId,
          channelName: this.channelName,
          userId: this.userId
        });

        return {
          appId: this.appId,
          token: this.token,
          channelName: this.channelName,
          userId: this.userId
        };
      } else {
        throw new Error('Invalid response from token API');
      }
    } catch (error) {
      console.error('❌ Error getting Agora token:', error);
      throw error;
    }
  }

  /**
   * Clear stored credentials
   */
  clearCredentials() {
    this.appId = null;
    this.token = null;
    this.channelName = null;
    this.userId = null;
  }
}

export default new AgoraService();
