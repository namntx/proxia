const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Tải biến môi trường từ file .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh (index.html) từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Danh sách proxy (lấy từ .env)
const proxies = [
    {
        id: 1,
        ip: process.env.PROXY_1_IP,
        port: parseInt(process.env.PROXY_1_PORT),
        type: process.env.PROXY_1_TYPE,
        username: process.env.PROXY_1_USERNAME,
        password: process.env.PROXY_1_PASSWORD
    },
    {
        id: 2,
        ip: process.env.PROXY_2_IP,
        port: parseInt(process.env.PROXY_2_PORT),
        type: process.env.PROXY_2_TYPE,
        username: process.env.PROXY_2_USERNAME,
        password: process.env.PROXY_2_PASSWORD
    }
];

// API xác thực và lấy danh sách proxy
app.post('/api/proxies', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    // Chỉ gửi thông tin an toàn (không gửi username/password)
    const safeProxies = proxies.map(({ id, ip, port, type }) => ({ id, ip, port, type }));
    res.json(safeProxies);
});

// API tạo URL Telegram cho proxy đã chọn
app.post('/api/connect', (req, res) => {
    const { password, proxyId } = req.body;
    if (password !== process.env.ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    const proxy = proxies.find(p => p.id === proxyId);
    if (!proxy) {
        return res.status(404).json({ error: 'Proxy không tồn tại' });
    }

    const telegramUrl = `tg://proxy?server=${proxy.ip}&port=${proxy.port}&secret=${proxy.username ? `${Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64')}@` : ''
        }${proxy.type.toLowerCase()}`;
    res.json({ telegramUrl });
});

// Lắng nghe trên cổng được định nghĩa trong .env hoặc mặc định 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên cổng ${PORT}`);
});