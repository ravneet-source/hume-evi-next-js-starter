"use client";

import { useEffect, useRef, useState } from "react";
import { HumeClient } from "@humeai/voice";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [client, setClient] = useState<any>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_HUME_CONFIG_ID) {
      console.error("Missing NEXT_PUBLIC_HUME_CONFIG_ID");
      return;
    }

    const hc = new HumeClient({
      configId: process.env.NEXT_PUBLIC_HUME_CONFIG_ID!,
      environment: "production",
    });

    setClient(hc);
  }, []);

  async function startInterview() {
    if (!client) return;

    setActive(true);

    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const camStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = camStream;
    }

    client.startSession({
      audio: true,
      video: true,
      enableTranscription: true,
      enableFacemesh: true,
      enableProsody: true,
      enableVocalBursts: true,
      enableFacialExpression: true,
    });
  }

  async function stopInterview() {
    if (!client) return;
    client.stopSession();
    setActive(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-black text-white">
      
      <h1 className="text-3xl font-bold mb-8">
        Career Maker — Video Interview
      </h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="rounded-xl border-2 border-gray-600 shadow-lg w-[400px] h-[300px] object-cover mb-8"
      />

      {!active ? (
        <button
          onClick={startInterview}
          className="bg-green-500 px-8 py-4 rounded-lg text-xl font-semibold"
        >
          Start Interview
        </button>
      ) : (
        <button
          onClick={stopInterview}
          className="bg-red-600 px-8 py-4 rounded-lg text-xl font-semibold"
        >
          Stop Interview
        </button>
      )}

      <p className="mt-8 opacity-50 text-sm">
        Video & voice being analyzed securely.
      </p>

    </main>
  );
}
