"use client";

import { useEffect, useRef, useState } from "react";
import { HumeClient } from "@humeai/voice";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [evi, setEvi] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_HUME_CONFIG_ID) {
      console.error("Missing NEXT_PUBLIC_HUME_CONFIG_ID");
      return;
    }

    const hc = new HumeClient({
      configId: process.env.NEXT_PUBLIC_HUME_CONFIG_ID!,
      environment: "production",
    });

    setEvi(hc);
  }, []);

  async function startInterview() {
    if (!evi) return;

    setIsActive(true);

    // request permissions
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // attach webcam stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // start Hume session
    evi.startSession({
      video: true,
      audio: true,
      enableTranscription: true,
      enableFacemesh: true,
      enableFacialExpression: true,
      enableVocalBursts: true,
      enableProsody: true,
    });
  }

  async function stopInterview() {
    if (!evi) return;

    setIsActive(false);

    evi.stopSession();
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 bg-black text-white">

      <h1 className="text-3xl font-bold mb-8">
        Career Maker — Video Interview
      </h1>

      {/* LIVE webcam */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        muted
        className="rounded-xl border-2 border-gray-600 shadow-lg w-[400px] h-[300px] object-cover mb-8"
      />

      {/* CTA BUTTON */}
      {!isActive ? (
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
        Your voice & expressions are being analyzed securely.
      </p>

    </main>
  );
}
