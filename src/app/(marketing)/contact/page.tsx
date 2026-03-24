"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare, Building2, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const offices = [
  { city: "Kuala Lumpur", address: "Level 12, Menara TM, Jalan Pantai Baru, 59200 KL", country: "Malaysia 🇲🇾", phone: "+60 3-1234 5678" },
  { city: "Singapore", address: "1 Raffles Place, #20-61 One Raffles Place, 048616", country: "Singapore 🇸🇬", phone: "+65 6123 4567" },
];

const topics = [
  { value: "sales", label: "Sales & Pricing" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing & Payouts" },
  { value: "press", label: "Press & Media" },
  { value: "partnership", label: "Partnerships" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="gradient-dark text-white py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
          <p className="text-white/70 text-lg">We'd love to hear from you. Our team typically responds within 2 business hours.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left — Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Contact Options</h2>
                <div className="space-y-4">
                  {[
                    { icon: MessageSquare, label: "Live Chat", value: "Available Mon–Fri, 9am–6pm MYT", action: "Start Chat" },
                    { icon: Mail, label: "Email", value: "support@eventix.io", action: null },
                    { icon: Phone, label: "Phone", value: "+60 3-1234 5678", action: null },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <c.icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{c.label}</p>
                        <p className="text-sm text-neutral-500">{c.value}</p>
                        {c.action && (
                          <button className="text-sm font-medium text-primary-600 hover:underline mt-0.5 flex items-center gap-1">
                            {c.action} <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Our Offices</h2>
                <div className="space-y-4">
                  {offices.map((o) => (
                    <div key={o.city} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <p className="font-semibold text-neutral-900">{o.city} {o.country}</p>
                      <p className="text-sm text-neutral-500 mt-1 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-neutral-400" /> {o.address}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" /> {o.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <p className="font-semibold text-primary-800 text-sm">Response Times</p>
                </div>
                <div className="text-xs text-primary-700 space-y-1 mt-2">
                  <p>💬 Live chat — under 5 minutes</p>
                  <p>📧 Email — within 2 business hours</p>
                  <p>📞 Phone — Mon–Fri 9am–6pm MYT</p>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success-600" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Message sent!</h2>
                  <p className="text-neutral-500 mb-6">Thanks for reaching out. We'll get back to you within 2 business hours.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 space-y-5">
                  <h2 className="text-xl font-bold text-neutral-900">Send us a message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Full Name *</Label>
                      <Input required placeholder="Ahmad Razif" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Work Email *</Label>
                      <Input required type="email" placeholder="ahmad@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company / Organization</Label>
                    <Input placeholder="Your company name" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Topic *</Label>
                    <select
                      required
                      value={form.topic}
                      onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Select a topic...</option>
                      {topics.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Message *</Label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button type="submit" className="gradient-primary text-white w-full">Send Message</Button>
                  <p className="text-xs text-neutral-400 text-center">By submitting, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
