'use client';

import { useState } from 'react';

export default function FindForm({ onSubmit }) {
  const [form, setForm] = useState({
    skills: '',
    interests: '',
    location: '',
    workMode: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Skills
        </label>

        <input
          type="text"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Python, Django, SQL"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Interests
        </label>

        <input
          type="text"
          name="interests"
          value={form.interests}
          onChange={handleChange}
          placeholder="Backend Development, AI"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferred Location
          </label>

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bangalore"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Work Mode
          </label>

          <select
            name="workMode"
            value={form.workMode}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent"
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
        className="rounded-lg bg-accent px-5 py-2.5 text-white hover:opacity-90"
      >
        Find Internship
      </button>
    </form>
  );
}