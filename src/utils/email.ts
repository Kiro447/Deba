import emailjs from '@emailjs/browser'
import { BUSINESS } from '../data/config'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? ''
const TEMPLATE_RESERVATION = import.meta.env.VITE_EMAILJS_TEMPLATE_RESERVATION ?? ''
const TEMPLATE_STATUS = import.meta.env.VITE_EMAILJS_TEMPLATE_STATUS ?? ''

function isConfigured(): boolean {
  return Boolean(SERVICE_ID && PUBLIC_KEY)
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
  if (!isConfigured() || !TEMPLATE_RESERVATION) return

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_RESERVATION,
      {
        to_email: BUSINESS.email,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.phone,
        car_name: data.carName,
        pickup_date: data.pickupDate,
        return_date: data.returnDate,
        notes: data.notes || 'N/A',
        business_name: BUSINESS.name,
        business_phone: BUSINESS.phone,
      },
      PUBLIC_KEY,
    )
  } catch (err) {
    console.error('EmailJS reservation notification failed:', err)
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
  if (!isConfigured() || !TEMPLATE_STATUS) return

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_STATUS,
      {
        to_email: data.customerEmail,
        customer_name: data.customerName,
        car_name: data.carName,
        pickup_date: data.pickupDate,
        return_date: data.returnDate,
        new_status: data.newStatus,
        business_name: BUSINESS.name,
        business_phone: BUSINESS.phone,
        business_email: BUSINESS.email,
      },
      PUBLIC_KEY,
    )
  } catch (err) {
    console.error('EmailJS status update notification failed:', err)
  }
}
