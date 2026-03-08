import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_CqXtj94r_Kvqkaisk5eXrnsEPvwv9NYg9");

export async function POST(req: NextRequest) {
  try {
    const { name, email, issueType, message } = await req.json();

    if (!name || !email || !issueType || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Continuum <reminders@continuumgrowth.org>",
      to: "uchfitness@gmail.com", // 👈 change to your actual admin email
      replyTo: email,
      subject: `[${issueType}] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888; width: 120px;">Name</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Email</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Issue Type</td>
              <td style="padding: 8px 0;">${issueType}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #eee; margin: 16px 0;" />
          <h3 style="color: #333;">Message</h3>
          <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
          <hr style="border: 1px solid #eee; margin: 16px 0;" />
          <p style="color: #aaa; font-size: 12px;">Sent via continuumgrowth.org contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}