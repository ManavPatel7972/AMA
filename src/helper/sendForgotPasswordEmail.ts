import { resend } from "@/lib/resend";
import { ApiResponse } from "./../types/ApiResponse";
import ForgotPasswordEmail from "../../emails/ForgotPasswordEmail";

export async function sendForgotPasswordEmail(
  username: string,
  email: string,
  resetLink: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      // from: "manavdelvadiya7972@gmail.com"
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Anonymous Message Reset Your Password ",
      react: ForgotPasswordEmail({ username, resetLink }),
    });

    return {
      success: true,
      message: "Reset password email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, message: "Failed to send reset password email." };
  }
}
