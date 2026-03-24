import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Eventix <onboarding@resend.dev>"; // Use resend.dev for testing

export async function sendOrderConfirmation({
  to,
  buyerName,
  orderReference,
  eventTitle,
  eventDate,
  eventVenue,
  tickets,
  total,
}: {
  to: string;
  buyerName: string;
  orderReference: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  tickets: { name: string; qty: number; price: number }[];
  total: number;
}) {
  const ticketLines = tickets
    .map((t) => `${t.qty}× ${t.name} — $${(t.price / 100).toFixed(2)} each`)
    .join("\n    ");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmed — ${eventTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">Eventix</div>
          </div>

          <h1 style="font-size: 24px; font-weight: 800; color: #111; margin-bottom: 8px;">You're going! 🎉</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${buyerName}, your order has been confirmed.</p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-weight: 700; color: #111; margin: 0 0 4px;">${eventTitle}</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 2px;">📅 ${eventDate}</p>
            <p style="color: #666; font-size: 14px; margin: 0;">📍 ${eventVenue}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="font-weight: 600; color: #111; margin-bottom: 8px;">Order Details</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 4px;">Reference: <strong style="font-family: monospace; color: #4F46E5;">${orderReference}</strong></p>
            <div style="font-size: 14px; color: #666; margin-top: 8px;">
              ${tickets.map((t) => `<p style="margin: 2px 0;">${t.qty}× ${t.name} — $${((t.price * t.qty) / 100).toFixed(2)}</p>`).join("")}
            </div>
            <p style="font-weight: 700; color: #111; font-size: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb;">Total: $${(total / 100).toFixed(2)}</p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/my/tickets" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; font-weight: 600; padding: 12px 32px; border-radius: 8px;">View My Tickets</a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            You received this email because you purchased tickets on Eventix.<br/>
            If you didn't make this purchase, please contact support.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
}

export async function sendTicketEmail({
  to,
  attendeeName,
  eventTitle,
  eventDate,
  eventVenue,
  ticketType,
  qrCode,
}: {
  to: string;
  attendeeName: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  ticketType: string;
  qrCode: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your Ticket — ${eventTitle}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">Eventix</div>
          </div>

          <h1 style="font-size: 24px; font-weight: 800; color: #111; margin-bottom: 8px;">Your Ticket</h1>
          <p style="color: #666; margin-bottom: 24px;">Hi ${attendeeName}, here's your ticket for the event.</p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="font-weight: 700; color: #111; margin: 0 0 4px; font-size: 18px;">${eventTitle}</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 2px;">📅 ${eventDate}</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 16px;">📍 ${eventVenue}</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; display: inline-block;">
              <p style="font-weight: 600; color: #4F46E5; margin: 0 0 4px;">${ticketType}</p>
              <p style="font-family: monospace; color: #999; font-size: 12px; margin: 0;">QR: ${qrCode}</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/my/tickets" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; font-weight: 600; padding: 12px 32px; border-radius: 8px;">View My Tickets</a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
            Present this ticket (QR code) at the event entrance.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send ticket email:", error);
  }
}
