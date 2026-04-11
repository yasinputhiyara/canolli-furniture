import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

// @desc  Get current user's cart
// @route GET /api/v1/cart
// @access Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price discountPrice slug stock"
    );

    if (!cart) {
      return res.status(200).json({ items: [], totalAmount: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Add item to cart (or increase qty if exists)
// @route POST /api/v1/cart
// @access Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.discountPrice || product.price;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity, price }],
        totalAmount: price * quantity,
        updatedAt: new Date(),
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price });
      }

      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      cart.updatedAt = new Date();
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name images price discountPrice slug stock"
    );

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update item quantity in cart
// @route PUT /api/v1/cart/:productId
// @access Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name images price discountPrice slug stock"
    );

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Remove item from cart
// @route DELETE /api/v1/cart/:productId
// @access Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.updatedAt = new Date();

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name images price discountPrice slug stock"
    );

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Clear entire cart
// @route DELETE /api/v1/cart
// @access Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(200).json({ message: "Cart already empty" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = new Date();

    await cart.save();
    res.status(200).json({ message: "Cart cleared", items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
