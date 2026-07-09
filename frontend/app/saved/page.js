'use client';

import { useEffect, useState } from 'react';
import { API_BASE, CURRENT_USER_ID } from '@/lib/api';
import InternshipCard from '../components/InternshipCard';

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/bookmarks?userId=${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Saved Internships
      </h1>

      {bookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No saved internships yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookmarks.map((bookmark) => (
            <InternshipCard
              key={bookmark._id}
              internship={bookmark.internshipId}
            />
          ))}
        </div>
      )}
    </div>
  );
}