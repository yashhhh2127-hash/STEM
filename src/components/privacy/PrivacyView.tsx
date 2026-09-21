import React from 'react';
import { Shield, Lock, FileText, CheckCircle2, Building, Heart } from 'lucide-react';
import { PROJECT_DETAILS } from '../../data/initialData';

export const PrivacyView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Privacy Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Academic Privacy & Research Ethics Policy
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Community Engagement Project • {PROJECT_DETAILS.department}, {PROJECT_DETAILS.institution}
        </p>
      </div>

      {/* Policy Content Blocks */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Educational Purpose & Non-Commercial Mandate
          </h2>
          <p>
            The <strong>STEM Education Support Using Free Digital Tools</strong> platform is developed solely for non-commercial educational outreach, community service, and academic research. It is completely free to use by school and junior-college students, educators, and parents. No fees, advertisements, or monetization mechanics are present.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            2. Strict Student Data Protection & Zero Commercial Tracking
          </h2>
          <p>
            We strictly believe that student learning environments must remain private and safe:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>No Data Brokering:</strong> We do NOT sell, rent, or trade student learning records, names, or contact details to third-party ad networks or data brokers.</li>
            <li><strong>Local State Storage:</strong> Learning progress, quiz scores, XP points, and streak counters are persisted locally on the client device (via browser localStorage), ensuring immediate privacy without external profiling.</li>
            <li><strong>No Tracking Cookies:</strong> No invasive behavioral marketing trackers or third-party fingerprinting scripts are utilized.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            3. Research Ethics & Student Survey Basis
          </h2>
          <p>
            The baseline student survey conducted across schools in Palghar was administered under strict academic confidentiality. Survey feedback was aggregated anonymously to identify macro curricular gaps (e.g., student need for visual simulations and low-cost practical kits). Individual survey responses are never publicly exposed or linked to individual student identities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            4. Institutional Compliance & Contact
          </h2>
          <p>
            This project operates under the oversight of the Department of Information Technology at Sonopant Dandekar Arts, V.S. Apte Commerce and M.H. Mehta Science College, Palghar.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1 mt-2">
            <p className="font-bold text-slate-900">Department of Information Technology</p>
            <p>Sonopant Dandekar Shikshan Mandali (SDES), Palghar - 401404, Maharashtra, India</p>
            <p>Email: it.department@palghar.edu • Academic Year: 2025–26</p>
          </div>
        </section>
      </div>
    </div>
  );
};
