"use client";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // Redirect to the new admin panel
    window.location.href = '/admin-panel';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <div>Redirecting to admin panel...</div>
      </div>
    </div>
  );
}
