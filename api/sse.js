// api/sse.js
export default function handler(req, res) {
  // 設定 CORS，允許所有網域存取
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 設定為 SSE (Server-Sent Events)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const sendData = () => {
    const carData = {
      carId: 'car-1',
      lat: 25.038 + (Math.random() - 0.5) * 0.01,  
      lng: 121.5645 + (Math.random() - 0.5) * 0.01
    };
    res.write(`data: ${JSON.stringify(carData)}\n\n`);
  };

  // 每秒推送一次
  const timer = setInterval(sendData, 1000);

  // 客戶端關閉連線後，清除計時器
  req.on('close', () => {
    clearInterval(timer);
  });
}
