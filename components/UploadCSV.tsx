import React, { useState } from "react";
import axios from "axios";

export default function UploadCSV({ onImported }: { onImported: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "">("");

  const upload = async () => {
    if (!file) {
      setMsgType("error");
      setMsg("Please select a CSV file.");
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload-csv",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMsgType("success");
      setMsg(`Successfully imported ${res.data.imported} trades.`);
      onImported();
    } catch (err: any) {
      setMsgType("error");
      setMsg(err?.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-gray-200">
      {/* Header */}
      <h3 className="font-bold text-xl mb-4">📤 Upload CSV</h3>

      {/* File Picker Box */}
      <label
        className="flex flex-col justify-center items-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-sm">
            {file ? file.name : "Click to choose CSV file"}
          </span>
          {!file && (
            <span className="text-xs text-gray-400 mt-1">
              (Only .csv files supported)
            </span>
          )}
        </div>
      </label>

      {/* Upload Button */}
      <button
        onClick={upload}
        disabled={loading}
        className={`w-full mt-4 py-3 rounded-xl text-white font-semibold 
          transition duration-200 ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {/* Status Message */}
      {msg && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm border ${
            msgType === "success"
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
