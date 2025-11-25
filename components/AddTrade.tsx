import React, { useState } from "react";
import axios from "axios";

export default function AddTrade({ onAdded }: { onAdded: () => void }) {
  const [symbol, setSymbol] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submitTrade = async () => {
    if (!symbol || !entry || !exit || !qty) {
      setMsg("All fields required.");
      return;
    }

    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; {
        symbol,
        entry_price: parseFloat(entry),
        exit_price: parseFloat(exit),
        qty: parseInt(qty),
        notes,
      });

      setMsg("Trade added successfully!");
      onAdded();

      setSymbol("");
      setEntry("");
      setExit("");
      setQty("");
      setNotes("");
    } catch (err) {
      setMsg("Failed to add trade.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-6 text-center">➕ Add Trade</h3>

      <div className="space-y-4">
        <input
          placeholder="Symbol (e.g., EURUSD)"
          className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />

        <input
          placeholder="Entry Price"
          type="number"
          className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <input
          placeholder="Exit Price"
          type="number"
          className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={exit}
          onChange={(e) => setExit(e.target.value)}
        />

        <input
          placeholder="Quantity"
          type="number"
          className="w-full p-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <textarea
          placeholder="Notes (optional)"
          className="w-full p-3 rounded-xl border shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none min-h-[90px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        onClick={submitTrade}
        disabled={loading}
        className="w-full mt-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add Trade"}
      </button>

      {msg && (
        <p className="mt-4 text-center text-sm text-gray-700 font-medium">
          {msg}
        </p>
      )}
    </div>
  );
}

