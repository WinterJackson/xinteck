import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to join the squad." },
        { status: 400 }
      );
    }

    // RESEND AUDIENCE INTEGRATION
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        await resend.contacts.create({
          email: email,
          unsubscribed: false,
          audienceId: process.env.RESEND_AUDIENCE_ID,
        });
      } catch (err) {
        console.error("Newsletter Subscription Error:", err);
      }
    }



    return NextResponse.json(
      {
        message: "Welcome to the vanguard. You'll receive our monthly lab reports soon.",
        status: "success"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Connection to the frequency was lost. Please try again." },
      { status: 500 }
    );
  }
}
