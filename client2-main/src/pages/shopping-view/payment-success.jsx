import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-10 text-center shadow-xl">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-3xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <p className="mb-6 text-gray-700">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Button onClick={() => navigate("/shop/account")} className="w-full">
          View My Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
