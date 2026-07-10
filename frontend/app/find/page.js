"use client";

import { useState } from "react";
import { buildUrl } from "@/lib/api";
import InternshipCard from "../components/InternshipCard";
import { toast } from "sonner";

export default function FindPage() {
  const [form, setForm] = useState({
    skills: "",
    interests: "",
    location: "",
    workMode: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);

    const loadingToast = toast.loading("Finding the best internships...");

    try {
      const res = await fetch(buildUrl("/api/find"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResults(data);
      setSearched(true);

      toast.success("Recommendations found!", {
        id: loadingToast,
      });
    } catch (err) {
      setError(err.message);

      toast.error(err.message, {
        id: loadingToast,
      });

      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-ink">
          Find Your Internship
        </h1>

        <p className="mt-2 text-slate-500">
          Tell us your skills and interests. AI will recommend the best internships.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-white p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Skills
          </label>

          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Python, Django, SQL"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Interests
          </label>

          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Backend Development, AI"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Bangalore"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Work Mode
            </label>

            <select
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Any</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent px-4 py-3 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Finding..." : "Find Internships"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold">
            Recommended Internships
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((internship) => (
              <div key={internship._id}>
                <InternshipCard internship={internship} />

                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-800">
                    Why AI Recommended This
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    {internship.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {searched && !loading && results.length === 0 && !error && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No internships found
          </h2>

          <p className="mt-2 text-slate-600">
            Try changing your skills or interests.
          </p>
        </div>
      )}
    </div>
  );
}