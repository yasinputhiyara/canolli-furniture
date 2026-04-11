import Order from "../../models/Order.js";

// @desc    Get all orders
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Valid statuses: "placed", "processing", "shipped", "delivered", "cancelled"
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    if (status === "cancelled") {
      order.isCancelled = true;
      order.cancelledAt = Date.now();
    } else {
      order.isCancelled = false;
      order.cancelledAt = null;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
