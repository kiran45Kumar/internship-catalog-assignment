'use client';

import { useEffect, useState } from 'react';
import { API_BASE, CURRENT_USER_ID } from '@/lib/api';

export default function SaveButton({ internshipId }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(
      `${API_BASE}/api/bookmarks?userId=${CURRENT_USER_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        const exists = data.some(
          (b) => b.internshipId?._id === internshipId
        );
        setSaved(exists);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [internshipId]);

  const toggleBookmark = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (saved) {
        await fetch(
          `${API_BASE}/api/bookmarks/${internshipId}?userId=${CURRENT_USER_ID}`,
          {
            method: 'DELETE',
          }
        );

        setSaved(false);
      } else {
        await fetch(`${API_BASE}/api/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            internshipId,
            userId: CURRENT_USER_ID,
          }),
        });

        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-60"
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}