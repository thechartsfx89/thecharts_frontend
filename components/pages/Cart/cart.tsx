"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import NoDataComponent from "@/utils/common/noDataComponent";
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
    <section className="bg-gradient-to-b from-white to-[#f3fbf6]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <AuthModals openModal={openModal} onClose={() => setOpenModal(null)} isMobile={true} />

        <h1 className="tc-serif mb-10 text-4xl font-black text-[#0b1b33] sm:text-5xl">Shopping Cart</h1>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">

            {Array.isArray(cartItems) && cartItems.length > 0 ? (
              cartItems.map((item: any) => (
                <div key={item.id} className="relative flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
                  <img
                    src={getImageUrl(item?.course_thumbnail?.url)}
                    alt={item?.name}
                    className="h-44 w-full rounded-2xl object-cover sm:h-36 sm:w-48"
                  />

                  <div className="min-w-0 flex-1 sm:pr-10">
                    <h2 className="text-lg font-bold text-[#0b1b33]">{item.course_title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">{item.course_desc}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-4 w-4" /> {item.hours} Total Hours
                      </span>
                      <span className="rounded-full bg-[#0b1b33] px-2.5 py-0.5 text-xs font-semibold text-white">Bestseller</span>
                      <span className="rounded-full bg-[#e9f8ef] px-2.5 py-0.5 text-xs font-semibold text-[#0e9f4a]">Premium</span>
                    </div>

                    <p className="tc-serif mt-3 text-xl font-black text-[#0b1b33]">
                      ₹ {Number(item.course_price || 0).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.course_title} from cart`}
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white">
                <NoDataComponent />
              </div>
            )}

          </div>

          {/* Cart Summary */}
          <div className="rounded-3xl bg-[#0b1b33] p-7 text-white shadow-2xl shadow-slate-900/20 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">Total</h2>
            <p className="tc-serif mt-2 text-4xl font-black">
              ₹ {totalAmount.toLocaleString("en-IN")}
            </p>
            <button onClick={handlePaymentSuccess} className="mt-6 w-full rounded-xl bg-[#16c75f] py-3.5 font-semibold text-[#0b1b33] transition hover:bg-[#2fe079]">
              Proceed to Checkout
            </button>
            <button className="mt-3 w-full rounded-xl border border-white/20 py-3.5 font-semibold text-white transition hover:bg-white/10">
              Apply Coupon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
