const {Order} = require("../models/order");
const OrderItem = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find();

  if (!orderList)
    res.status(500).json({
      success: false,
    });
  else res.send(orderList);
});

router.post("/", async (req, res) => {
  // Multiple orders will come from the request so we need to loop
  const orderItemIDs = Promise.all(req.body.orderItems.map(async (orderItem) => {

    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product,
    });
    newOrderItem = await newOrderItem.save();

    return newOrderItem._id; // we need only id of the order item
  }));

  let order = new Order({
    orderItems: orderItemIDs,
    address: req.body.address,
    country: req.body.country,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
    phone: req.body.phone,
  });

  order = await order.save();
  if (!order)
    res.status(500).json({
      success: false,
    });
  else res.send(order);
});


module.exports = router;