// app/page.tsx
import { Suspense } from "react";
import InterviewUI from "./interview-ui";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";

export const dynamic = "force-dynamic";

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  // --- DEBUGGING: CHECK TERMINAL OUTPUT ---
  if (!accessToken) {
    console.error("❌ ERROR: Access Token is EMPTY. Check HUME_API_KEY/SECRET_KEY.");
  } else {
    console.log("✅ SUCCESS: Generated Access Token. Length:", accessToken.length);
  }
  // ----------------------------------------

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Interview...</div>}>
      <InterviewUI accessToken={accessToken} />
    </Suspense>
  );
}
