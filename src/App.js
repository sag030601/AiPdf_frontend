// src/App.jsx
import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setDocument(res.data);
      setAnswer("");
    } catch (err) {
      alert("Upload failed!");
      console.error(err);
    }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!document?._id || !question) return;
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/document/${document._id}/ask`, { question });
      setAnswer(res.data.answer || "No answer found.");
    } catch (err) {
      alert("Failed to get answer!");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6">📄 AI Document Summarizer</h1>

      {/* File Upload */}
      <div className="mb-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button
          onClick={handleUpload}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload & Summarize"}
        </button>
      </div>

      {/* Document Display */}
      {document && (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">📎 {document.filename}</h2>
            <h3 className="text-lg font-medium">Summary:</h3>
            <p className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{document.summary}</p>

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-500">View Full Text</summary>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 mt-2 rounded max-h-64 overflow-auto">
                {document.fullText}
              </pre>
            </details>
          </div>

          {/* Ask Questions */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">❓ Ask a question about the document:</h3>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="e.g., What is the document about?"
            />
            <button
              onClick={handleAsk}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? "Thinking..." : "Get Answer"}
            </button>

            {answer && (
              <div className="mt-4 bg-green-100 p-3 rounded">
                <strong>Answer:</strong> {answer}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
