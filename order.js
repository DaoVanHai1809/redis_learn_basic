const express = require("express");
const app = express();
const redis = require("redis");

const publish = redis.createClient({
  url: "redis://127.0.0.1:6379",
});
// Xử lý lỗi kết nối
publish.on("error", (err) => console.error("❌ Lỗi Redis:", err));

(async () => {
  await publish.connect();
  console.log("✅ Đã kết nối Redis");
})();
app.get("/order", (req, res) => {
  const order = [
    {
      productId: 1,
      price: 5000,
    },
    {
      productId: 2,
      price: 10000,
    },
  ];
  // send to payment and sendmain service
  publish.publish("ordersystem", JSON.stringify(order));

  res.json({
    status: "success",
    message: "Your order has been",
  });
});

app.listen(3000, () => {
  console.log("Order service started on port 3000");
});
