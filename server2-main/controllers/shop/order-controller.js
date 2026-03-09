const { instance: razorpayInstance } = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const crypto = require("crypto");

// Helper function for validation
const validatePaymentData = (amount, currency) => {
  if (typeof amount !== "number" || amount <= 0) return "Invalid amount.";
  if (!currency || typeof currency !== "string" || currency.length !== 3)
    return "Invalid currency.";
  return null;
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod = "Razorpay",
      totalAmount,
      cartId,
    } = req.body;

    const validationError = validatePaymentData(totalAmount, "INR");
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: userId.toString(),
        cartId: cartId || "N/A",
      },
    });

    // Save internal order
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "DRAFT",
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order: newOrder,
      razorpayOrder,
      razorpayKeyId: process.env.RAZORPAY_KEY,
    });
  } catch (e) {
    console.error("Error while creating Razorpay order:", e);
    res.status(500).json({
      success: false,
      message: "Error while creating Razorpay order",
      error: e.message,
    });
  }
};

// CAPTURE PAYMENT
const capturePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId: internalOrderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !internalOrderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details for verification.",
      });
    }

    const order = await Order.findById(internalOrderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Order ID mismatch.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Signature mismatch.",
      });
    }

    // Update order and stock
    order.paymentStatus = "PAID";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        order.orderStatus = "stock_issue";
        order.paymentStatus = "FAILED";
        await order.save();
        return res.status(500).json({
          success: false,
          message: `Stock issue for product "${item.title}"`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed.",
      data: order,
    });
  } catch (e) {
    console.error("Error during payment capture:", e);
    res.status(500).json({
      success: false,
      message: "Error verifying payment.",
      error: e.message,
    });
  }
};

// GET ALL ORDERS BY USER
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.error("Error fetching orders:", e);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching orders.",
        error: e.message,
      });
  }
};

// GET ORDER DETAILS
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("Error fetching order details:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching order details.",
      error: e.message,
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
