import { asyncHandler } from "../../core/utils/async-handler.js";
import Payment from "../../models/Payment.model.js";
import Order from "../../models/Order.model.js";
import Transaction from "../../models/Transaction.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";

//-------------------- CREATE PAYMENT --------------------//
const createPayment = asyncHandler(async (req, res) => {
    const { orderId, method, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.totalAmount !== amount) throw new ApiError(400, "Amount mismatch");

    const payment = await Payment.create({
        order: orderId,
        method,
        amount,
        status: "pending"
    });

    // For COD, mark order paymentStatus as pending immediately
    if (method === "cod") {
        order.paymentStatus = "pending";
        await order.save();
    }

    return res.status(201).json(new ApiResponse(201, payment, "Payment initiated successfully"));
});

//-------------------- UPDATE PAYMENT STATUS --------------------//
const updatePaymentStatus = asyncHandler(async (req, res) => {
    const { status, transactionId } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) throw new ApiError(404, "Payment not found");

    payment.status = status || payment.status;
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save();

    // Reflect status on the related order
    const order = await Order.findById(payment.order);
    if (order) {
        if (payment.status === "success") order.paymentStatus = "paid";
        else if (payment.status === "failed") order.paymentStatus = "failed";
        else order.paymentStatus = "pending";
        await order.save();
    }

    return res.status(200).json(new ApiResponse(200, payment, "Payment updated successfully"));
});

//-------------------- GET PAYMENT DETAILS --------------------//
const getPayment = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id).populate("order");
    if (!payment) throw new ApiError(404, "Payment not found");
    return res.status(200).json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

//-------------------- GATEWAY WEBHOOK --------------------//
const gatewayWebhook = asyncHandler(async (req, res) => {
    const { paymentId, status, transactionId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new ApiError(404, "Payment not found");

    payment.status = status || payment.status;
    payment.transactionId = transactionId || payment.transactionId;
    await payment.save();

    const order = await Order.findById(payment.order);
    if (order) {
        if (payment.status === "success") order.paymentStatus = "paid";
        else if (payment.status === "failed") order.paymentStatus = "failed";
        else order.paymentStatus = "pending";
        await order.save();
    }

    return res.status(200).json(new ApiResponse(200, payment, "Webhook processed"));
});

export { createPayment, updatePaymentStatus, getPayment, gatewayWebhook };
