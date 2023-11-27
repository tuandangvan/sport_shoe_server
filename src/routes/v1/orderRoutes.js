import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { orderController } from "../../controllers/OrderController.js";

const route = express.Router();

// ? GET ALL ORDER BY ADMIN
route.get(
  "/all",
  authMiddleware.protect,
  authMiddleware.admin,
  orderController.getAllOrderByAdmin
);

route.get(
  "/sort-by-status",
  authMiddleware.protect,
  authMiddleware.admin,
  orderController.getAllOrderByStatusSorting
);

// GET ORDER BY ID
route.get("/:id", authMiddleware.protect, orderController.getOrderById);

// ORDER IS PAID
route.put("/:id/pay", authMiddleware.protect, orderController.updateOrderPaid);

// ? CHECK ORDER IS DELIVERED BY ADMIN
route.put(
  "/change-status",
  authMiddleware.protect,
  authMiddleware.admin,
  orderController.updateStatusOrder
);

// DELETE ORDER BY ID | ADMIN

route.delete("/:id", authMiddleware.protect, orderController.deleteOrderId);

// DELETE FORCE BY ID | ADMIN
// route.delete(
//   "/:id/force",
//   authMiddleware.protect,
//   authMiddleware.admin,
//   orderController.deleteOrderIdForce
// );

// RESTORE ORDER BY ID | ADMIN
route.patch(
  "/:id/restore",
  authMiddleware.protect,
  authMiddleware.admin,
  orderController.restoreOrderById
);

// CREATE ORDER
route.post("/", authMiddleware.protect, orderController.orderCreate);

// USERS LOGIN ORDER
route.get("/", authMiddleware.protect, orderController.getOrderByUser);

export const orderRouter = route;
