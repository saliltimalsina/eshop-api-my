const { Order } = require("../models/order");
const OrderItem = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "username")
    .sort({ dateOrdered: -1 });

  if (!orderList)
    res.status(500).json({
      success: false,
    });
  else res.send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "username")
    .populate({
      path: "orderItem",
      populate: 'product',
    });

  if (!order)
    res.status(500).json({
      success: false,
    });
  else res.send(order);
});

router.post("/", async (req, res) => {
  // Multiple orders will come from the request so we need to loop
  // as user is sending multiple items so we need to combine all the promise
  const orderItemIDs = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id; // we need only id of the order item
    })
  );

  // let them resolve first
  const orderItemsIdsResolved = await orderItemIDs;

  let order = new Order({
    orderItems: orderItemsIdsResolved,
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
