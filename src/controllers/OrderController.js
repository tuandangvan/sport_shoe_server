import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import product from "../models/ProductModel.js";
import Product from "../models/ProductModel.js";
import { multipleMongooseToObject } from "../utils/mongooseUtils";

// @desc    Create Order
// @route   POST /api/orders
// @access  Private

const handlerOrderItems = (orderItemsReq) => {
  var orderItems = [];
  orderItemsReq.forEach((item) => {
    const product = item.product;
    var orderItem = {
      name: product.productName,
      image: product.image,
      price: product.price,
      product: product.id,
      typeProduct: {
        color: item.typeSelect.color,
        size: item.typeSelect.size,
        quantity: item.qty
      }
    };
    orderItems.push(orderItem);
  });
  return orderItems;
};

const orderCreate = asyncHandler(async (req, res) => {
  const orderItems = handlerOrderItems(req.body.orderItems);
  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
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
      totalPrice
    });

    orderItems.forEach(async (item) => {
      const typeProduct = await product.findOne(
        {
          _id: item.product,
          "typeProduct.color": item.typeProduct.color,
          "typeProduct.size": item.typeProduct.size
        },
        {
          "typeProduct.$": 1, // Chỉ lấy mảng typeProduct chứa color và size cần tìm
          _id: 0 // Không lấy id
        }
      );

      const quantity = typeProduct.typeProduct[0].quantity;

      const result = await Product.updateOne(
        {
          _id: item.product,
          "typeProduct.color": item.typeProduct.color,
          "typeProduct.size": item.typeProduct.size
        },
        {
          $set: {
            "typeProduct.$.quantity": quantity - item.typeProduct.quantity
          }
        }
      );

      const product2 = await Product.findOne({ _id: item.product });
      const countInStock = product2.typeProduct.reduce(
        (totalQuantity, itemCurrent) => itemCurrent.quantity + totalQuantity,
        0
      );
      product2.countInStock = countInStock;
      await product2.save();
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

const getAllOrderByStatusSorting = asyncHandler(async (req, res) => {
  const getAllOrderByQuerySorting = await Order.find({
    status: req.query.status
  })
    .sort({ _id: -1 })
    .populate("user", "id name email");
  if (getAllOrderByQuerySorting) {
    res.json({
      size: getAllOrderByQuerySorting.length,
      data: getAllOrderByQuerySorting
    });
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
      email_address: req.body.email_address
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

const updateStatusOrder = asyncHandler(async (req, res) => {
  const orderId = req.query.id;
  const status = req.query.status;
  const order = await Order.findById(orderId);

  if (order) {
    order.status = status;
    if (parseInt(status) === 2) {
      order.deliveredAt = Date.now();
    }
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

export const orderController = {
  orderCreate,
  getOrderById,
  updateOrderPaid,
  getOrderByUser,
  getAllOrderByAdmin,
  getAllOrderByStatusSorting,
  updateStatusOrder,
  deleteOrderId,
  deleteOrderIdForce,
  restoreOrderById
};
