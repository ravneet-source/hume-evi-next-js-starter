// components/ui/Chat.tsx
"use client";

import { useVoice } from "@humeai/voice-react";
import { useState } from "react";

type ChatProps = {
  accessToken: string;
  token?: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  interviewQuestions?: string;
};

export default function Chat({
  accessToken,
  token,
  candidateName,
  candidateEmail,
  jobTitle,
  interviewQuestions,
}: ChatProps) {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [error, setError] = useState<string | null>(null);

  const startInterview = async () => {
    try {
      setError(null);
      const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;
      
      // --- DEBUGGING LOGS ---
      console.log("--- Debugging Connection ---");
      console.log("1. Config ID present?", !!configId, configId);
      console.log("2. Access Token present?", !!accessToken, accessToken ? accessToken.substring(0, 10) + "..." : "MISSING");
      // ----------------------

      if (!configId) {
        throw new Error("NEXT_PUBLIC_HUME_CONFIG_ID is missing. Check .env.local");
      }

      if (!accessToken) {
        throw new Error("Access Token is missing. Server failed to fetch it.");
      }

      await connect({
        configId,
        auth: { type: "accessToken", value: accessToken },
      });
      
    } catch (err: any) {
      console.error("Hume connect error:", err);
      setError(`Hume error: ${err?.message || String(err)}`);
    }
  };

  const isConnected = readyState === 'open';

  return (
    <div className="w-full p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className={`px-2 py-1 text-xs rounded-full ${isConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
          Status: {readyState}
        </div>
      </div>

      {!isConnected ? (
        <button
          onClick={startInterview}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full font-semibold transition-colors"
        >
          Start Interview
        </button>
      ) : (
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full font-semibold transition-colors"
        >
          End Interview
        </button>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="h-64 overflow-y-auto border rounded bg-gray-50 p-2 text-sm space-y-2">
        {messages.length === 0 && <p className="text-gray-400 italic">Transcript will appear here...</p>}
        {messages.map((msg, index) => {
          if (msg.type === "user_message" || msg.type === "assistant_message") {
            return (
              <div key={index} className={msg.type === "user_message" ? "text-right" : "text-left"}>
                <span className={`inline-block px-2 py-1 rounded ${msg.type === "user_message" ? "bg-blue-100" : "bg-white border"}`}>
                   {msg.message.content}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
