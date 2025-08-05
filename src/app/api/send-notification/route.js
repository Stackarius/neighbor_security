import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    // Basic validation
    if (!to || (!text && !html)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing `to`, and either `text` or `html` field.",
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "NSW Security <onboarding@resend.dev>", // This must be a verified domain in Resend
      to, // Can be string or array
      subject,
      text,
      html,
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: emailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Resend Error]", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Something went wrong.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
