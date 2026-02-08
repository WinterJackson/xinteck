import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, service, budget, message } = data;

    // VALIDATION
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // RESEND INTEGRATION
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: [process.env.RESEND_TO_EMAIL || "admin@xinteck.com"], // Fallback should be your signup email for testing
          subject: `New Inquiry: ${name}`,
          text: `
            Name: ${name}
            Email: ${email}
            Service: ${service}
            Budget: ${budget}
            
            Message:
            ${message}
          `,
        });
      } catch (err) {
        console.error("Resend Error:", err);
        // We continue anyway so the user gets a positive feedback if the data was logged
      }
    }



    // SUCCESS RESPONSE
    return NextResponse.json(
      {
        message: "Your inquiry has been launched into our orbit. Our engineers will reach out within 4 hours.",
        status: "success"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "The signal was lost. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
