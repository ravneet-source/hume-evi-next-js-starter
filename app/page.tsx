"use client";

import { useEffect, useRef, useState } from "react";
import { HumeClient } from "@humeai/web";

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
    client.stopSe
