import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "./../types/ApiResponse";
import { createInitialRSCPayloadFromFallbackPrerender } from "next/dist/client/flight-data-helpers";

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const mail = await resend.emails.send({
      // from: "manavdelvadiya7972@gmail.com"
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Anonymous Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("MAIN  main res ===============", mail)

    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
