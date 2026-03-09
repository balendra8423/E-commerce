const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cartId: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: String,
          required: true,
        },
        title: String,
        image: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "PayPal", "paypal", "Razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["DRAFT", "PAID", "FAILED"],
      default: "DRAFT",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderUpdateDate: {
      type: Date,
      default: Date.now,
    },
    razorpayOrderId: {
      type: String,
      required: function () {
        return this.paymentMethod === "Razorpay";
      },
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
