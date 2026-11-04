import { PageHero, TcPage } from "@/components/pages/Landing/page-shell";

export default function PrivacyPolicy() {
  return (
    <TcPage>
      <PageHero eyebrow="Legal" title="Privacy & Policy" />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="tc-prose mx-auto max-w-3xl">

            {/* Content */}
              <p>
                This Privacy Policy describes how <b>M/s The Charts</b> (hereinafter
                referred to as <b>“The Charts”</b>) collects, uses, and protects
                personal data received from The Charts Business Owner Partners
                (SBO Partners) and New Registered Customers (NRCs).
              </p>

              <h4>
                How We May Collect or Receive Personal Data from You
              </h4>
              <p><b>Registration:</b> The Charts collects your personal data through the registration form completed and submitted via paper or electronically through the The Charts website.</p>
              <p><b>Logged In as SBO Partner or NRC:</b> We may collect your data when you order products or services while logged in.</p>
              <p><b>Contacting Us:</b> You may submit personal data through our communication channels listed on the “Contact Us” page.</p>
              <p><b>Cookies:</b> If you are logged in, we may use cookies to collect Website usage data. You can disable cookies in your browser settings, but some website features may not work properly.</p>

              <h4>
                The Types of Personal Data We May Collect
              </h4>
              <ul>
                <li>Contact information (name, address, email, phone number)</li>
                <li>Gender, age, nationality, date and place of birth</li>
                <li>Marital Status</li>
                <li>SBO Partner or NRC number, username</li>
                <li>Passport details, National ID, and related identification information</li>
                <li>Performance information, product preferences, purchase history, and behavior</li>
                <li>Website usage data such as IP address, browser type, etc.</li>
              </ul>

              <h4>
                The Types of Sensitive Personal Data We May Collect
              </h4>
              <ul>
                <li>Passwords for accessing our site</li>
                <li>Payment information such as bank account or credit card numbers</li>
              </ul>

              <h4>
                How We Use the Personal and Sensitive Data We Collect
              </h4>
              <ul>
                <li>To manage your registration and account</li>
                <li>To process product or service orders</li>
                <li>To communicate with you regarding updates or services</li>
                <li>To operate, evaluate, and improve our business</li>
                <li>To track and analyze your usage behavior</li>
                <li>To assess your performance under your The Charts agreement</li>
                <li>To provide information to your upline or downline</li>
                <li>To perform accounting, billing, and compliance processes</li>
              </ul>

              <p>
                If you withdraw consent, The Charts may not be able to continue
                providing services and reserves the right to terminate your
                contract.
              </p>

              <h4>
                How We May Share Personal and Sensitive Data
              </h4>
              <ul>
                <li>Entities within The Charts for operations</li>
                <li>Government authorities as required by law</li>
                <li>SBO Partners in your upline or downline</li>
                <li>Servicing Distributors for NRCs</li>
              </ul>

              <h4>
                How We Protect Personal Data
              </h4>
              <p>We maintain technical and organizational safeguards to protect your data.</p>

              <h4>
                How Long We Retain Personal Data
              </h4>
              <p>We retain personal data only as long as necessary or required by law.</p>

              <h4>
                Updates to this Privacy Policy
              </h4>
              <p>
                Updates will be published on{" "}
                <a
                  href="https://www.thechartsfx.com"
                >
                  www.thechartsfx.com
                </a>
              </p>

              <h4>
                Acceptance of this Privacy Policy
              </h4>
              <p>By signing the contract, you accept this Privacy Policy.</p>

              <h4>
                Your Rights
              </h4>
              <p>You have the right to access and correct your data.</p>

              <h4>
                How to Contact Us
              </h4>
              <p>
                Mr. Johnny Walkar <br />
                📧 Email:{" "}
                <a
                  href="mailto:thechartsfx89@gmail.com"
                >
                  thechartsfx89@gmail.com
                </a>
              </p>
        </div>
      </section>
    </TcPage>
  );
}
