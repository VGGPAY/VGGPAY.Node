const axios = require('axios');
const crypto = require('crypto');

class VGGPaymentGateway {
    constructor(config) {
        this.APIServerUrl = 'https://sapi.vggpay.com';
        this.projectId = config.projectId || '';
        this.SecretKey = config.SecretKey || '';
        this.SecretIV = config.SecretIV || '';
    }

    /**
     * Create an Order
     * @param {Object} orderData
     * @returns {Promise}
     */
    async createOrder(orderData) {
        const path = '/api/v2/createorder';

        const m_orderid = orderData.m_orderid || '';
        const currency = orderData.currency || '';
        const amount = orderData.amount || '';

        if (!m_orderid) return '"m_orderid" cannot be empty';
        if (!currency) return '"currency" cannot be empty';
        if (!amount) return '"amount" cannot be empty';

        orderData['projectid'] = this.projectId;

        // Encrypt data
        const postData = JSON.stringify({
            data: this.encryptData(JSON.stringify(orderData)), // Encrypted data
            projectid: this.projectId
        });

        // Send request
        return this.sendRequest(postData, this.APIServerUrl + path);
    }

    /**
     * Create a Top-up
     * @param {Object} topupData
     * @returns {Promise}
     */
    async createTopUp(topupData) {
        const m_userid = topupData.m_userid || '';
        if (!m_userid) return '"m_userid" cannot be empty';

        const path = '/api/v2/createtopup';

        topupData['projectid'] = this.projectId;

        // Encrypt data
        const encryptedData = this.encryptData(JSON.stringify(topupData));
        const postData = JSON.stringify({
            data: encryptedData,
            projectid: this.projectId
        });

        return this.sendRequest(postData, this.APIServerUrl + path);
    }

    /**
     * Send HTTP POST request
     * @param {string} postData
     * @param {string} url
     * @returns {Promise}
     */
    async sendRequest(postData, url) {
        try {
            const response = await axios.post(url, postData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            return `Error: ${error.response ? error.response.status : error.message}`;
        }
    }

    /**
     * Encrypt data using AES-256-CBC
     * @param {string} data
     * @returns {string} Base64 encoded encrypted data
     */
    encryptData(data) {
        const key = Buffer.from(this.SecretKey, 'hex'); // Convert SecretKey to binary
        const iv = Buffer.from(this.SecretIV, 'hex'); // Convert IV to binary
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    /**
     * Decrypt data using AES-256-CBC
     * @param {string} encryptedData
     * @returns {Object} Decrypted data
     */
    decryptData(encryptedData) {
        const key = Buffer.from(this.SecretKey, 'hex');
        const iv = Buffer.from(this.SecretIV, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted); // Assuming data is in JSON format
    }

    /**
     * Error Detection for missing configuration
     * @returns {string} Error message if configuration is missing
     */
    errorDetection() {
        if (!this.projectId) return '"projectId" cannot be empty';
        if (!this.SecretKey) return '"SecretKey" cannot be empty';
        if (!this.SecretIV) return '"SecretIV" cannot be empty';
        return '';
    }
}

module.exports = VGGPaymentGateway;
