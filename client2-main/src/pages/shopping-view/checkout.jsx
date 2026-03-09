import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  createNewOrder,
  capturePayment,
  resetPaymentStatus,
} from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, item) =>
            sum +
            (item?.salePrice > 0 ? item?.salePrice : item?.price) *
              item?.quantity,
          0
        )
      : 0;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayCheckout = async (
    razorpayOrder,
    razorpayKeyId,
    internalOrderId
  ) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast({
        title: "Razorpay SDK failed to load.",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
      return;
    }

    const options = {
      key: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Your Shop Name",
      description: "Order Payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          const captureAction = await dispatch(
            capturePayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: internalOrderId,
            })
          );

          if (captureAction.payload?.success) {
            toast({
              title: "Payment Successful!",
              description: "Your order has been placed.",
            });
            window.location.href = "/shop/payment-success";
          } else {
            toast({
              title: "Payment Verification Failed",
              description:
                captureAction.payload?.message || "Something went wrong.",
              variant: "destructive",
            });
            setIsPaymentStart(false);
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast({
            title: "Payment Error",
            description:
              error.message || "Unexpected error during verification.",
            variant: "destructive",
          });
          setIsPaymentStart(false);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: currentSelectedAddress?.phone || "",
      },
      notes: {
        orderId: internalOrderId,
        userId: user?.id,
        email: user?.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.error("Razorpay Payment Failed:", response.error);
      toast({
        title: "Payment Failed",
        description:
          response.error.description || "Payment could not be processed.",
        variant: "destructive",
      });
      setIsPaymentStart(false);
    });
  };

  const handleCheckout = () => {
    if (!cartItems?.items?.length) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "No address selected",
        description: "Please choose a shipping address.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "Razorpay",
      paymentStatus: "DRAFT",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    dispatch(createNewOrder(orderData))
      .then((action) => {
        const {
          razorpayOrder,
          razorpayKeyId,
          order: internalOrder,
        } = action.payload || {};

        console.log("razorpayOrder:", razorpayOrder);
        console.log("razorpayKeyId:", razorpayKeyId);
        console.log("internalOrder:", internalOrder);

        if (
          action.payload?.success &&
          razorpayOrder &&
          razorpayKeyId &&
          internalOrder
        ) {
          openRazorpayCheckout(razorpayOrder, razorpayKeyId, internalOrder._id);
        } else {
          toast({
            title: "Failed to initialize payment",
            description: "Razorpay order creation failed.",
            variant: "destructive",
          });
          setIsPaymentStart(false);
        }
      })
      .catch((error) => {
        console.error("Order creation error:", error);
        toast({
          title: "Order Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        setIsPaymentStart(false);
      });
  };

  useEffect(() => {
    return () => {
      dispatch(resetPaymentStatus());
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="object-cover object-center w-full h-full"
          alt="Checkout Banner"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 mt-5 sm:grid-cols-2">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <UserCartItemsContent
              key={item.productId || item._id}
              cartItem={item}
            />
          ))}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalCartAmount.toFixed(2)}</span>
            </div>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full mt-4"
            disabled={isPaymentStart}
          >
            {isPaymentStart
              ? "Processing Payment..."
              : "Checkout with Razorpay"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
