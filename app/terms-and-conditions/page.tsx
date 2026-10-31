import Header from "@/app/dashboard/landing/headerLanding";
import Footer from "@/components/pages/Footer/footer";

export default function TermsAndConditions() {
  return (
    <>
      <Header />

      <section className="bg-[#f8faf5] py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl px-5 sm:px-8 lg:px-12 py-8 sm:py-10">
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-green-700 mb-8 sm:mb-10">
            Terms and Conditions
          </h1>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed">

            <p>
              Access to and use of the <b>educandle.com</b> Website (hereinafter referred to as the{" "}
              <b>Educandle Website</b>) and the information, materials, products, and services
              available through it are subject to these Terms of Use.
            </p>

            <p>
              The Website Terms of Use may be updated periodically. Updated versions will be
              posted on the Educandle Website and take effect immediately.
            </p>

            <p>
              The Educandle Website provides information on <b>Educandle</b>, its business,
              products, and services, and is intended solely for use within the Republic of
              India under Indian law.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              1. Password-Protected Parts of the Educandle Website
            </h4>
            <p>
              Password-protected sections are exclusively for SBO Partners and NRCs in India.
              Passwords must not be shared and should be safeguarded.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              2. Educandle Privacy Statement and Policies
            </h4>
            <p>
              All personal data is handled in accordance with the Educandle Privacy Policy.
              Incorrect or outdated information may result in restricted access.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              3. Copyright and Use of Website Materials
            </h4>
            <p>
              All Website Materials are protected by intellectual property laws. Unauthorized
              reproduction or modification is prohibited.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              4. Links to Other Websites
            </h4>
            <p>
              Educandle is not responsible for third-party websites linked from this site.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              5. Links from Other Websites
            </h4>
            <p>
              Linking to <b>www.educandle.com</b> requires prior written approval.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              6. Limitation of Liability
            </h4>
            <p>
              Educandle is not liable for damages arising from website use, including data loss
              or service interruption.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              7. Restricting Access
            </h4>
            <p>
              Educandle reserves the right to restrict or block access for violations.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              8. Severability
            </h4>
            <p>
              Invalid provisions do not affect the remaining Terms.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              9. Governing Law & Jurisdiction
            </h4>
            <p>
              Governed by Indian law. Courts of <b>Roorkee, Haridwar</b> have exclusive jurisdiction.
            </p>

            <h4 className="text-lg sm:text-xl font-bold text-green-700 mt-6 mb-2">
              10. Notice
            </h4>
            <p>
              Contact our Grievance Officer <b>Mr. Johnny Walkar</b> at{" "}
              <a href="mailto:info@educandle.com" className="text-green-600 underline">
                info@educandle.com
              </a>.
            </p>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
