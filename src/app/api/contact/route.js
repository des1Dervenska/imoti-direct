import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Website <onboarding@resend.dev>';

export async function POST(request) {
  if (!process.env.RESEND_API_KEY || !TO_EMAIL) {
    return NextResponse.json(
      { error: 'Email is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 }
      );
    }

    const subjectLabel = subject || '(no subject)';
    const accentColor = '#0097b2';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ново запитване</title>
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background:#ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="background: ${accentColor}; padding: 24px 28px;">
              <h1 style="margin:0; color:#ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">Ново запитване от сайта</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Контактна форма</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Име</span><br>
                    <span style="color: #1e293b; font-size: 16px; font-weight: 500;">${escapeHtml(name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Имейл</span><br>
                    <a href="mailto:${escapeHtml(email)}" style="color: ${accentColor}; font-size: 16px; text-decoration: none; font-weight: 500;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Телефон</span><br>
                    <span style="color: #1e293b; font-size: 16px;">${phone ? escapeHtml(phone) : '—'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Тема</span><br>
                    <span style="color: #1e293b; font-size: 16px; font-weight: 500;">${escapeHtml(subjectLabel)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0;">
                    <span style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Съобщение</span><br>
                    <div style="margin-top: 8px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid ${accentColor}; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 28px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin:0; color: #94a3b8; font-size: 12px;">Изпратено от контактната форма на сайта</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Запитване: ${subjectLabel}`,
      html,
    });

    if (error) {
      console.error('[Resend]', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
