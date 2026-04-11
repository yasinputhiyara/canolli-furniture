import Order from "../../models/Order.js";

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided." });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount,
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      orderStatus: "placed"
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.orderStatus !== "placed" && order.orderStatus !== "processing") {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    order.orderStatus = "cancelled";
    order.isCancelled = true;
    order.cancelledAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
