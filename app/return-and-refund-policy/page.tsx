import Header from "@/app/dashboard/landing/headerLanding";
import Footer from "@/components/pages/Footer/footer";

export default function BuybackRefundExchangePolicy() {
  return (
    <>
      <Header />

      <section className="bg-[#f8faf5] py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10">
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-700 mb-8 sm:mb-10">
            Buyback Refund & Exchange Policy
          </h1>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed">
            
            <p>
              At <b>M/s The Charts</b> (hereinafter referred to as <b>“The Charts”</b>), it’s our
              passion to ensure the highest quality of our products and your complete
              satisfaction. However, if our products do not meet your expectations, you may
              return them within <b>30 days</b> from the date of invoice, provided you notify
              us within one week of purchase either by calling us or emailing us at{" "}
              <a
                href="mailto:thechartsfx89@gmail.com"
                className="text-green-600 underline"
              >
                thechartsfx89@gmail.com
              </a>.
            </p>

            <p>
              The refund policy is applicable only for products in <b>saleable condition</b> and
              partially used products (not exceeding 30%) if accompanied by a valid invoice.
              Intentionally damaged or misused products are not eligible for return.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Refund / Returns Policy
            </h4>
            <ul>
              <li>
                If the product is in <b>marketable*</b> condition and returned within 30 days
                with the original invoice, <b>5%</b> handling charges will be deducted.
              </li>
              <li>
                If the product is <b>unmarketable**</b>, refund value will be assessed by the
                Returns Officer.
              </li>
            </ul>

            <p>
              *<b>Marketable</b> means unopened and sealed products. <br />
              **<b>Unmarketable</b> means opened or seal-broken products.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Exchange Policy
            </h4>
            <p>
              Products can be exchanged within <b>30 days</b> of invoice date with the original
              invoice and the following:
            </p>
            <ul>
              <li>Product Return Form</li>
              <li>Invoice Copy</li>
              <li>Original packaging & marketable condition</li>
              <li>Replacement product of equal or higher value</li>
            </ul>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Refunds
            </h4>
            <p>
              After inspection, refunds will be processed to your registered bank account or
              original payment method. <b>No cash refunds</b> will be issued.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Shipping Cost
            </h4>
            <p>
              Return shipping costs are borne by the customer and are non-refundable unless
              otherwise decided by The Charts.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Cancellation of Orders
            </h4>
            <p>
              <b>By The Charts:</b> Orders may be canceled due to stock or technical issues with
              refunds issued via original payment mode.
            </p>
            <p>
              <b>By Customer:</b> Orders can be canceled before processing. Once processed,
              cancellation is not allowed.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Reference Notes
            </h4>
            <ul>
              <li>Products must be returned to the head office with a return form</li>
              <li>Return period is calculated till receipt at The Charts office</li>
              <li>BV points will be adjusted in the next payout</li>
              <li>Returned products cannot be repurchased within 30 days</li>
              <li>
                For details visit{" "}
                <a
                  href="https://www.thechartsfx.com"
                  className="text-green-600 underline"
                >
                  www.thechartsfx.com
                </a>{" "}
                or email{" "}
                <a
                  href="mailto:thechartsfx89@gmail.com"
                  className="text-green-600 underline"
                >
                  thechartsfx89@gmail.com
                </a>
              </li>
            </ul>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
