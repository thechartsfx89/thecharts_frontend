"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/app/context/cart-context";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import { removeFromCart, removePurchasedItems } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { getImageUrl } from "@/utils/common/common";
import Link from "next/link";
import IconLogin from "@/components/icon/icon-login";
import AuthModals from "@/component/auth/authModal";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, totalAmount } = useSelector((state: IRootState) => state.cart);
  const dispatch = useDispatch();
  const [itemIds, setItemIds] = useState<any>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  //  console.log({status})
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      const ids = cartItems.map((item: any) => item.id);
      setItemIds(ids); // replace state with new array
    }
  }, [cartItems]);

  console.log([itemIds], '>>>>>> cart items');
  const handlePaymentSuccess = async (paymentInfo: any) => {
    await fetch("/api/checkout", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemsId: itemIds,
        userId: session?.user?.id,
        // userId: currentUser.id,
        // paymentId: paymentInfo.id,
        // amount: paymentInfo.amount,
        // status: "success",
      }),
    });
    dispatch(removePurchasedItems(itemIds));
    if (status == "unauthenticated") {
      setOpenModal(null);
      setTimeout(() => setOpenModal("login"), 10);
    }else{
      router.push("/checkout");
    }

  };
  const [openModal, setOpenModal] = useState<"login" | "signup" | "forgot" | null>(null);

  return (
    <div className="lg:py-12 py-2.5 xl:px-10 lg:px-2.5 px-2.5  container mx-auto">
      <AuthModals openModal={openModal} onClose={() => setOpenModal(null)} isMobile={true} />

      <h1 className="lg:text-3xl text-2xl font-michroma lg:mb-16 mb-5">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 ">
        {/* Cart Items */}
        <div className="col-span-2 space-y-4">

          {Array.isArray(cartItems) && cartItems.length > 0 ? (
            cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-wrap gap-4 p-5 border rounded-2xl shadow-sm relative panel"
              >
                <img
                  src={getImageUrl(item?.course_thumbnail?.url)}
                  alt={item?.name}
                  className="lg:w-40 w-32 lg:h-40 h-32 rounded-lg object-cover"
                />

                <div className="flex-1 w-full">
                  <h2 className="lg:text-xl text-lg font-[500] mb-2">{item.course_title}</h2>
                  <p className="text-gray-500 flex-grow font-[400] text-[14px] line-clamp-2">{item.course_desc}</p>

                  <div className="flex items-center justify-start gap-2 mt-3">
                    <span className="lg:text-lg text-sm">🕒 {item.hours} Total Hours</span>

                    <span className="text-white text-sm bg-[#E31E24] px-2 py-[2px] rounded font-[500] cursor-pointer">
                      Bestseller
                    </span>
                    <span className="text-sm bg-[#62C76F] px-2 py-[2px] rounded font-[500] cursor-pointer">
                      Premium
                    </span>
                  </div>

                  <p className="lg:text-lg text-sm font-michroma mt-2">
                    ₹ {Number(item.course_price || 0).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-black hover:text-red-500 lg:relative absolute top-6 right-3"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 border rounded-2xl shadow-sm">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2H5V7h14v8h-4v2m-4 4h4v-4H9v4z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mt-4 font-medium">No data found</p>
              <p className="text-sm text-gray-400">Please check your search or filters</p>
            </div>
          )}

        </div>

        {/* Cart Summary */}
        <div className="col-span-1 p-6 border rounded-2xl shadow-sm panel ">
          <h2 className="lg:text-xl text-lg font-bold mb-2 font-michroma">Total</h2>
          <p className="lg:text-lg text-sm font-semibold mb-4 font-michroma">
            ₹ {totalAmount.toLocaleString("en-IN")}
          </p>
          {/* <Link href="/checkout"> */}
          {/* <button
              className="w-full text-left hover:text-green-600"
              onClick={(e) => {
                e.stopPropagation();
                setOpenModal(null);
                setTimeout(() => setOpenModal("login"), 10);
              }}
            >

              <IconLogin className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
              Login
            </button> */}
          <button onClick={handlePaymentSuccess} className="w-full bg-[#92DD84] text-black py-3 lg:text-lg  text-sm rounded-xl font-semibold  shadow hover:bg-green-500 transition">
            Proceed to Checkout
          </button>
          {/* </Link> */}
          <button className="w-full bg-gray-200 mt-3 py-3 rounded-xl lg:text-lg text-sm font-semibold shadow hover:bg-gray-300 transition">
            Apply Coupon
          </button>
        </div>
      </div>
    </div>
  );
}
