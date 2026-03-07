import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { reservationSchema, statusUpdateSchema } from '../lib/validation'
import { requireAuth } from '../middleware/auth'
import { sendReservationEmail, sendStatusUpdateEmail } from '../services/email'

const router = Router()

// GET /api/reservations (admin)
router.get('/', requireAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { vehicle: { select: { name: true } } },
    })
    const result = reservations.map((r) => ({
      id: r.id,
      vehicleId: r.vehicleId,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: r.phone,
      pickupDate: r.pickupDate,
      returnDate: r.returnDate,
      notes: r.notes || '',
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      vehicleName: r.vehicle.name,
    }))
    res.json(result)
  } catch (err) {
    console.error('Failed to fetch reservations:', err)
    res.status(500).json({ error: 'Failed to fetch reservations' })
  }
})

// POST /api/reservations (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = reservationSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
    return
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        vehicleId: parsed.data.vehicleId,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        pickupDate: parsed.data.pickupDate,
        returnDate: parsed.data.returnDate,
        notes: parsed.data.notes,
      },
      include: { vehicle: { select: { name: true } } },
    })

    // Send email notification to business
    sendReservationEmail({
      customerName: `${parsed.data.firstName} ${parsed.data.lastName}`,
      customerEmail: parsed.data.email,
      phone: parsed.data.phone,
      carName: reservation.vehicle.name,
      pickupDate: parsed.data.pickupDate,
      returnDate: parsed.data.returnDate,
      notes: parsed.data.notes,
    }).catch(() => {}) // fire and forget

    res.status(201).json({
      id: reservation.id,
      vehicleId: reservation.vehicleId,
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      email: reservation.email,
      phone: reservation.phone,
      pickupDate: reservation.pickupDate,
      returnDate: reservation.returnDate,
      notes: reservation.notes || '',
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString(),
      vehicleName: reservation.vehicle.name,
    })
  } catch (err) {
    console.error('Failed to create reservation:', err)
    res.status(500).json({ error: 'Failed to create reservation' })
  }
})

// PUT /api/reservations/:id/status (admin)
router.put('/:id/status', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = statusUpdateSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid status' })
    return
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id as string },
      data: { status: parsed.data.status },
    })

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: reservation.vehicleId },
      select: { name: true },
    })

    // Send email notification to customer
    sendStatusUpdateEmail({
      customerName: `${reservation.firstName} ${reservation.lastName}`,
      customerEmail: reservation.email,
      carName: vehicle?.name ?? '',
      pickupDate: reservation.pickupDate,
      returnDate: reservation.returnDate,
      newStatus: parsed.data.status,
    }).catch(() => {}) // fire and forget

    res.json({
      id: reservation.id,
      status: reservation.status,
    })
  } catch (err) {
    console.error('Failed to update reservation status:', err)
    res.status(500).json({ error: 'Failed to update reservation status' })
  }
})

export default router
