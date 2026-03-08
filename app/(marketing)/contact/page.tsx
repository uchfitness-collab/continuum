"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.issueType || !formData.message) {
      setErrorMsg("Please fill out all fields.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setFormData({ name: "", email: "", issueType: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-4 py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-gray-400 text-base">
            Have a question, issue, or feedback? We read every message.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">Message Sent</h2>
            <p className="text-gray-400">
              We got it. You'll hear back within 24–48 hours.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-8 space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors"
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Issue Type</label>
              <select
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors appearance-none"
              >
                <option value="" disabled>Select a category</option>
                <option value="Bug">Bug / Technical Issue</option>
                <option value="Billing">Billing</option>
                <option value="Feature">Feature Request</option>
                <option value="General">General Question</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Message</label>
              <textarea
                placeholder="Describe your issue or question..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500/50 transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3.5 rounded-xl transition-colors"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            <p className="text-center text-gray-600 text-xs">
              You can also reach us directly at{" "}
              <a href="mailto:support@continuumgrowth.org" className="text-green-500 hover:underline">
                support@continuumgrowth.org
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}