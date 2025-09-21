// src/js/api.js
export async function analyzeText(text) {
  const res = await fetch("https://lightning-guard-backend.onrender.com/api/analyze-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
