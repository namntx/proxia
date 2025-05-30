const dotenv = require('dotenv');

dotenv.config();

module.exports = async (req, res) => {
    console.log('API /api/proxies called with method:', req.method, 'body:', req.body);
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    if (password !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    const proxies = [
        {
            id: 1,
            ip: process.env.PROXY_1_IP,
            port: parseInt(process.env.PROXY_1_PORT),
            type: process.env.PROXY_1_TYPE
        },
        {
            id: 2,
            ip: process.env.PROXY_2_IP,
            port: parseInt(process.env.PROXY_2_PORT),
            type: process.env.PROXY_2_TYPE
        }
    ];

    res.json(proxies);
};