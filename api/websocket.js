const http = require('http');
const { Server } = require('socket.io');

// 創建一個 HTTP 伺服器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server Running');
});

// 創建 Socket.io 伺服器
const io = new Server(server);

// 當有新的 WebSocket 連線時
io.on('connection', (socket) => {
  console.log('新連線');

  // 模擬每秒推送車輛座標
  setInterval(() => {
    const carData = {
      carId: 'car-1',
      lat: 25.038 + (Math.random() - 0.5) * 0.01,  // 假設隨機變動座標
      lng: 121.5645 + (Math.random() - 0.5) * 0.01
    };
    socket.emit('carData', carData);  // 推送車輛座標資料給前端
  }, 1000);

  // 客戶端斷開連線時
  socket.on('disconnect', () => {
    console.log('連線已斷開');
  });
});

// 啟動伺服器，Vercel 將會自動處理此部分
module.exports = (req, res) => {
  server.listen(0, () => {
    console.log('WebSocket 伺服器已啟動');
    res.status(200).send('WebSocket Server Running');
  });
};
