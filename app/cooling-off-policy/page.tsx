// app/cooling-off-policy/page.tsx
import Header from "@/app/dashboard/landing/headerLanding";
import Footer from "@/components/pages/Footer/footer";

export default function CoolingOffPolicy() {
  return (
    <>
      <Header />

      <section className="bg-[#f8faf5] py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white shadow rounded-xl sm:rounded-2xl p-5 sm:p-7 lg:p-8">
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-700 mb-6 sm:mb-8 lg:mb-10">
              COOLING OFF POLICY
            </h1>

            {/* Intro */}
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              We, <b>M/s Educandle</b>, comply with the{" "}
              <b>Consumer Protection (Direct Selling) Rules, 2021</b> and the
              <b> Consumer Protection Act, 2019</b>. In accordance with Clause 3(b)
              of the Rules, we provide every newly registered{" "}
              <b>Independent Distributor</b> a <b>30-day cooling-off period</b>{" "}
              effective from the date of signing and execution of the contract
              agreement during registration.
            </p>

            <p className="text-sm sm:text-base text-gray-800 leading-relaxed mt-4">
              During this 30-day period, the Independent Distributor may{" "}
              <b>cancel the contract agreement</b> without this resulting in a
              breach of contract and without any <b>penalty</b>.
            </p>

            {/* Applicability */}
            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Applicability
            </h4>
            <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-1">
              <li>Applies only to newly registered Independent Distributors.</li>
              <li>Starts from the contract signing/execution date.</li>
              <li>Cancellation within this period does not attract penalties.</li>
            </ul>

            {/* How to cancel */}
            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              How to Cancel
            </h4>
            <ol className="list-decimal pl-5 sm:pl-6 text-sm sm:text-base text-gray-800 leading-relaxed space-y-1">
              <li>
                Send an email from your registered email ID to{" "}
                <a
                  href="mailto:info@educandle.com"
                  className="text-green-700 underline break-all"
                >
                  info@educandle.com
                </a>{" "}
                within 30 days.
              </li>
              <li>
                Mention your full name, Distributor ID (if issued), date of
                agreement, and contact number.
              </li>
              <li>You will receive a confirmation email after verification.</li>
            </ol>

            {/* Note */}
            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              Note
            </h4>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              This policy is an integral part of the{" "}
              <b>Contract Agreement</b> executed by an Independent Distributor
              and may not be reproduced verbatim in the agreement for brevity.
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
