"use client";

import { useEffect, useState } from "react";
import { API_BASE, CURRENT_USER_ID } from "@/lib/api";
import { toast, Toaster } from "sonner";

export default function ApplyButton({ internshipId }) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success'
  const [justApplied, setJustApplied] = useState(false);
  useEffect(() => {
    async function checkApplicationStatus() {
      try {
        const res = await fetch(
          `${API_BASE}/api/applications?userId=${CURRENT_USER_ID}`,
        );

        if (!res.ok) return;

        const applications = await res.json();

        const alreadyApplied = applications.some(
          (app) => app.internshipId?._id === internshipId,
        );

        if (alreadyApplied) {
          setStatus("success");
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkApplicationStatus();
  }, [internshipId]);

  const apply = async () => {
    setStatus("loading");
    try {
      await fetch(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId,
          userId: CURRENT_USER_ID,
        }),
      });
      setStatus("success");
      toast.success("Application submitted successfully!");
      setJustApplied(true);
    } catch (err) {
      toast.error("Failed to apply for the internship.");
      setStatus("success");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Toaster position="top-right" richColors />
      <button
        onClick={apply}
        disabled={status === "loading" || status === "success"}
        className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
      >
        {status === "loading"
          ? "Applying…"
          : status === "success"
            ? "Applied ✓"
            : "Apply now"}
      </button>
      {/* {justApplied && (
        <span className="text-sm text-emerald-700">Application submitted!</span>
      )} */}
    </div>
  );
}
