const express = require("express");
const { protect, admin } = require("../middleware/Auth");
const orderRouter = express.Router();
const {
  orderCreate,
  getOrderById,
  updateOrderPaid,
  getOrderByUser,
  getAllOrderByAdmin,
  updateDeliveredOrder,
  deleteOrderId,
  deleteOrderIdForce,
  restoreOrderById,
} = require("../controllers/OrderController");

// ? GET ALL ORDER BY ADMIN
orderRouter.get("/all", protect, admin, getAllOrderByAdmin);

// GET ORDER BY ID
orderRouter.get("/:id", protect, getOrderById);

// ORDER IS PAID
orderRouter.put("/:id/pay", protect, updateOrderPaid);

// ? CHECK ORDER IS DELIVERED BY ADMIN
orderRouter.put("/:id/delivered", protect, updateDeliveredOrder);

// DELETE ORDER BY ID | ADMIN

orderRouter.delete("/:id", protect, deleteOrderId);

// DELETE FORCE BY ID | ADMIN
orderRouter.delete("/:id/force", protect, admin, deleteOrderIdForce);

// RESTORE ORDER BY ID | ADMIN

orderRouter.patch("/:id/restore", protect, admin, restoreOrderById);

// CREATE ORDER
orderRouter.post("/", protect, orderCreate);

// USERS LOGIN ORDER
orderRouter.get("/", protect, getOrderByUser);

module.exports = orderRouter;
