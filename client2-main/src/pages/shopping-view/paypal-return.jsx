import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function RazorpayReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract Razorpay query params
  const params = new URLSearchParams(location.search);
  const razorpayPaymentId = params.get("razorpay_payment_id");
  const razorpayOrderId = params.get("razorpay_order_id");
  const razorpaySignature = params.get("razorpay_signature");

  useEffect(() => {
    const orderId = sessionStorage.getItem("currentOrderId");

    if (razorpayPaymentId && razorpayOrderId && razorpaySignature && orderId) {
      dispatch(
        capturePayment({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
          orderId,
        })
      ).then((action) => {
        if (action?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          navigate("/shop/payment-success");
        } else {
          navigate("/shop/payment-failed");
        }
      });
    } else {
      navigate("/shop/payment-failed");
    }
  }, [
    dispatch,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    navigate,
  ]);

  return (
    <Card className="max-w-md p-6 mx-auto mt-20 shadow-md">
      <CardHeader>
        <CardTitle className="text-center">
          Processing Razorpay Payment... Please wait!
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default RazorpayReturnPage;
