const express = require("express");
const app = express();
const redis = require("redis");

const subscribe = redis.createClient({
  url: "redis://127.0.0.1:6379",
});
// Xử lý lỗi kết nối
subscribe.on("error", (err) => console.error("❌ Lỗi Redis:", err));

(async () => {
  await subscribe.connect();
  console.log("✅ Đã kết nối Redis");

  // Đăng ký kênh "ordersystem" sau khi kết nối thành công
  await subscribe.subscribe("ordersystem", (message, channel) => {
    console.log(`📢 Sendmail Service Nhận tin nhắn từ kênh: ${channel}`);

    try {
      const data = JSON.parse(message); // Kiểm tra nếu JSON hợp lệ
      console.log("📩 Nội dung tin nhắn:", data);
    } catch (error) {
      console.error("❌ Lỗi parse JSON:", error.message);
    }
  });
})();
app.listen(3002, () => {
  console.log("Sendmail service started on port 3002");
});
