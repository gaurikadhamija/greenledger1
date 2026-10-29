import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does GreenLedger verify sustainability data?',
      a: 'GreenLedger links every metric directly to primary utility bills (PDFs, utility bills, and sub-meter registers). Values are extracted optically and presented side-by-side with the original document so an authorized auditor or facilities manager can confirm them before calculations execute.',
    },
    {
      q: 'Can I upload existing electricity bills?',
      a: 'Yes. GreenLedger accepts standard utility PDFs, scanned invoices, and photos of utility bills. Our ingestion engine identifies the utility provider, meter ID, billing period dates, total kilowatt-hours, peak demand kilowatts, and billed amounts automatically.',
    },
    {
      q: 'What happens if document extraction is incorrect?',
      a: 'AI optical extraction is never treated as final until verified. The auditor reviews the extracted numbers directly adjacent to highlighted bounding boxes on the document and can edit dates, kilowatt-hours, or tariff amounts with one click.',
    },
    {
      q: 'How are electricity comparisons calculated?',
      a: 'Comparisons are strictly computed using audited, deterministic code—never black-box machine learning models. We compute total kilowatt-hour differences, percentage changes, and Average Daily Usage (kWh/day) to normalize for calendar variations such as 28-day vs 33-day billing windows.',
    },
    {
      q: 'Does GreenLedger automatically certify sustainability claims?',
      a: 'GreenLedger does not issue decorative marketing seals. Instead, it generates a transparent Green Scorecard with an explicit Evidence Coverage percentage, documented emissions factor citations (e.g., EPA eGRID CAMX), and open mathematical formulas ready for third-party assurance.',
    },
    {
      q: 'Can I export a report for auditors and leadership?',
      a: 'Yes. You can instantly generate high-fidelity, printable executive summaries and download complete JSON audit trails containing all underlying invoices, formulas, reviewer notes, and timestamped actions.',
    },
    {
      q: 'How is uploaded data protected?',
      a: 'All invoices and ledger records are stored securely with tamper-resistant SHA-256 document fingerprints. Data remains isolated to your institution with role-based access control and detailed audit trails.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#f0edde] border-t border-[#cfc7b4] relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Pramaan Section Tag */}
        <div className="pr-secmark mb-6">
          <span className="pr-secmark__n">
            07 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <span className="pr-secmark__label">Questions</span>
        </div>

        {/* Section Heading */}
        <div className="mb-16">
          <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
            The questions businesses<br />
            <em>actually ask us.</em>
          </h2>
          <p className="st-lede mt-4">
            Clear, honest answers regarding data extraction, arithmetic determinism, and sustainability reporting integrity.
          </p>
        </div>

        {/* Accordion Rows */}
        <div className="divide-y divide-[#cfc7b4] border-y border-[#cfc7b4]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-start justify-between gap-6 text-left cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-xl md:text-2xl font-serif text-[#21150f] group-hover:text-[#960d41] transition-colors">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-[#f4f0e5] border border-[#cfc7b4] text-[#21150f] shrink-0 mt-1">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 text-sm sm:text-base text-[#574539] leading-relaxed font-sans font-light animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
