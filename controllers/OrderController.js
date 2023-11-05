const asyncHandler = require("express-async-handler");
const Order = require("../models/OrderModel");
const { multipleMongooseToObject } = require("../utils/mongoose");
// @desc    Create Order
// @route   POST /api/orders
// @access  Private

const orderCreate = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No ordered items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

// @desc    Get Order By ID
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc    Get All Order By Admin
// @route   GET /api/orders/all
// @access  Private

const getAllOrderByAdmin = asyncHandler(async (req, res) => {
  const getAllOrder = await Order.find({})
    .sort({ _id: -1 })
    .populate("user", "id name email");

  if (getAllOrder) {
    res.json(getAllOrder);
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

// @desc    update order is paid & not paid
// @route   PUT /api/orders/:id/pay
// @access  Private

const updateOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc    update order is delivered & not delivered
// @route   PUT /api/orders/:id/delivered
// @access  Private

const updateDeliveredOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order Not Found");
  }
});

// @desc    Get Order In Profile
// @route   GET /api/users/
// @access  Private

const getOrderByUser = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });

  res.json(order);
});

// @desc    update order is paid & not paid
// @route   DELETE /api/orders/:id/
// @access  Private

const deleteOrderId = asyncHandler(async (req, res) => {
  const orderId = await Order.findById(req.params.id);

  if (orderId) {
    await orderId.remove();
    res.json({ message: "Order deleted" });
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

// [DELETE]
const deleteOrderIdForce = asyncHandler(async (req, res) => {
  const orderId = await Order.findById(req.params.id);
  if (orderId) {
    await orderId.deleteOne();
    res.json({ message: "Order is totally force deleted", order: {} });
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

// [PATCH]
const restoreOrderById = asyncHandler(async (req, res, next) => {
  const orderId = await Order.findById(req.params.id);
  if (orderId) {
    await orderId.restore();
    res.json({ message: "Order successfully restored" });
  } else {
    res.status(404);
    throw new Error("Order not Found");
  }
});

module.exports = {
  orderCreate,
  getOrderById,
  updateOrderPaid,
  getOrderByUser,
  getAllOrderByAdmin,
  updateDeliveredOrder,
  deleteOrderId,
  deleteOrderIdForce,
  restoreOrderById,
};
