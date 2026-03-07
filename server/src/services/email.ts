import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const EMAIL_FROM = process.env.EMAIL_FROM || ''
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || ''
const BUSINESS_NAME = 'Deba Car Rental'
const BUSINESS_PHONE = '+389 74 203 753'

function isConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function sendReservationEmail(data: {
  customerName: string
  customerEmail: string
  phone: string
  carName: string
  pickupDate: string
  returnDate: string
  notes: string
}): Promise<void> {
  if (!isConfigured()) return

  try {
    await transporter.sendMail({
      from: `"${BUSINESS_NAME}" <${EMAIL_FROM}>`,
      to: BUSINESS_EMAIL,
      subject: `New Reservation: ${data.carName} - ${data.customerName}`,
      html: `
        <h2>New Reservation</h2>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 12px;font-weight:bold;">Customer:</td><td style="padding:4px 12px;">${data.customerName}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Email:</td><td style="padding:4px 12px;">${data.customerEmail}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Phone:</td><td style="padding:4px 12px;">${data.phone}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Vehicle:</td><td style="padding:4px 12px;">${data.carName}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Pickup:</td><td style="padding:4px 12px;">${data.pickupDate}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Return:</td><td style="padding:4px 12px;">${data.returnDate}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Notes:</td><td style="padding:4px 12px;">${data.notes || 'N/A'}</td></tr>
        </table>
      `,
    })
  } catch (err) {
    console.error('Failed to send reservation email:', err)
  }
}

export async function sendStatusUpdateEmail(data: {
  customerName: string
  customerEmail: string
  carName: string
  pickupDate: string
  returnDate: string
  newStatus: string
}): Promise<void> {
  if (!isConfigured()) return

  const statusLabel = data.newStatus === 'confirmed' ? 'Confirmed' : data.newStatus === 'cancelled' ? 'Cancelled' : data.newStatus

  try {
    await transporter.sendMail({
      from: `"${BUSINESS_NAME}" <${EMAIL_FROM}>`,
      to: data.customerEmail,
      subject: `Reservation ${statusLabel} - ${BUSINESS_NAME}`,
      html: `
        <h2>Reservation ${statusLabel}</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your reservation for <strong>${data.carName}</strong> has been <strong>${statusLabel.toLowerCase()}</strong>.</p>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 12px;font-weight:bold;">Vehicle:</td><td style="padding:4px 12px;">${data.carName}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Pickup:</td><td style="padding:4px 12px;">${data.pickupDate}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Return:</td><td style="padding:4px 12px;">${data.returnDate}</td></tr>
          <tr><td style="padding:4px 12px;font-weight:bold;">Status:</td><td style="padding:4px 12px;">${statusLabel}</td></tr>
        </table>
        <br>
        <p>If you have questions, contact us:</p>
        <p>Phone: ${BUSINESS_PHONE}<br>Email: ${BUSINESS_EMAIL}</p>
        <p>— ${BUSINESS_NAME}</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send status update email:', err)
  }
}
