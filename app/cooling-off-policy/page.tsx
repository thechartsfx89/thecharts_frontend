// app/cooling-off-policy/page.tsx
import { PageHero, TcPage } from "@/components/pages/Landing/page-shell";

export default function CoolingOffPolicy() {
  return (
    <TcPage>
      <PageHero eyebrow="Legal" title="Cooling Off Policy" />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="tc-prose mx-auto max-w-3xl">

            {/* Intro */}
            <p>
              We, <b>M/s Educandle</b>, comply with the{" "}
              <b>Consumer Protection (Direct Selling) Rules, 2021</b> and the
              <b> Consumer Protection Act, 2019</b>. In accordance with Clause 3(b)
              of the Rules, we provide every newly registered{" "}
              <b>Independent Distributor</b> a <b>30-day cooling-off period</b>{" "}
              effective from the date of signing and execution of the contract
              agreement during registration.
            </p>

            <p>
              During this 30-day period, the Independent Distributor may{" "}
              <b>cancel the contract agreement</b> without this resulting in a
              breach of contract and without any <b>penalty</b>.
            </p>

            {/* Applicability */}
            <h4>
              Applicability
            </h4>
            <ul>
              <li>Applies only to newly registered Independent Distributors.</li>
              <li>Starts from the contract signing/execution date.</li>
              <li>Cancellation within this period does not attract penalties.</li>
            </ul>

            {/* How to cancel */}
            <h4>
              How to Cancel
            </h4>
            <ol>
              <li>
                Send an email from your registered email ID to{" "}
                <a
                  href="mailto:info@educandle.com"
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
            <h4>
              Note
            </h4>
            <p>
              This policy is an integral part of the{" "}
              <b>Contract Agreement</b> executed by an Independent Distributor
              and may not be reproduced verbatim in the agreement for brevity.
            </p>
        </div>
      </section>
    </TcPage>
  );
}
