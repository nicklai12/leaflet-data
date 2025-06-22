// api/sse.js
export default function handler(req, res) {
  // 1. 處理 CORS preflight（EventSource 不會送 OPTIONS，但加上也無害）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. 設定成 SSE，好讓瀏覽器長連線接收 streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 3. 初始 N 輛車資料
  const cars = [
    { carId: 'car-1', lat: 25.038,   lng: 121.5645 },
    { carId: 'car-2', lat: 25.040,   lng: 121.5650 },
    { carId: 'car-3', lat: 25.0365,  lng: 121.5630 },
  ];

  // 4. 每秒隨機小幅平移所有車輛，並 push 整個陣列
  const sendData = () => {
    const updated = cars.map(c => ({
      carId: c.carId,
      lat: c.lat + (Math.random() - 0.5) * 0.005,
      lng: c.lng + (Math.random() - 0.5) * 0.005
    }));
    // SSE 格式：「data: <payload>\n\n」
    res.write(`data: ${JSON.stringify(updated)}\n\n`);
  };
  const timer = setInterval(sendData, 1000);

  // 5. 客戶端關閉連線時要清除計時器
  req.on('close', () => {
    clearInterval(timer);
  });
}
