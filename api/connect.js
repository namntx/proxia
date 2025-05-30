const dotenv = require('dotenv');

dotenv.config();

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password, proxyId } = req.body;
    if (password !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    const proxies = [
        {
            id: 1,
            ip: process.env.PROXY_1_IP,
            port: parseInt(process.env.PROXY_1_PORT),
            type: process.env.PROXY_1_TYPE,
            username: process.env.PROXY_1_USERNAME,
            password: process.env.PROXY_1_PASSWORD,
            secret: process.env.PROXY_1_SECRET
        },
        {
            id: 2,
            ip: process.env.PROXY_2_IP,
            port: parseInt(process.env.PROXY_2_PORT),
            type: process.env.PROXY_2_TYPE,
            username: process.env.PROXY_2_USERNAME,
            password: process.env.PROXY_2_PASSWORD,
            secret: process.env.PROXY_2_SECRET
        }
    ];

    const proxy = proxies.find(p => p.id === proxyId);
    if (!proxy) {
        return res.status(404).json({ error: 'Proxy không tồn tại' });
    }

    const telegramUrl = `tg://proxy?server=${proxy.ip}&port=${proxy.port}&secret=${proxy.secret}`;
    res.json({ telegramUrl });
};