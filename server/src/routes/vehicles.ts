import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { vehicleSchema } from '../lib/validation'
import { requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/vehicles (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'asc' },
    })
    const result = vehicles.map((v) => ({
      id: v.id,
      name: v.name,
      category: v.category,
      year: v.year,
      doors: v.doors,
      seats: v.seats,
      transmission: v.transmission,
      fuel: v.fuel,
      hp: v.hp,
      pricePerDay: v.pricePerDay,
      currency: v.currency,
      image: v.image,
      images: v.images,
      features: v.features,
      available: v.available,
    }))
    res.json(result)
  } catch (err) {
    console.error('Failed to fetch vehicles:', err)
    res.status(500).json({ error: 'Failed to fetch vehicles' })
  }
})

// POST /api/vehicles (admin)
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = vehicleSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
    return
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        id: parsed.data.id || undefined,
        name: parsed.data.name,
        category: parsed.data.category,
        year: parsed.data.year,
        doors: parsed.data.doors,
        seats: parsed.data.seats,
        transmission: parsed.data.transmission,
        fuel: parsed.data.fuel,
        hp: parsed.data.hp,
        pricePerDay: parsed.data.pricePerDay,
        currency: parsed.data.currency,
        image: parsed.data.image,
        images: parsed.data.images,
        features: parsed.data.features,
        available: parsed.data.available,
      },
    })
    res.status(201).json(vehicle)
  } catch (err) {
    console.error('Failed to create vehicle:', err)
    res.status(500).json({ error: 'Failed to create vehicle' })
  }
})

// PUT /api/vehicles/:id (admin)
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const parsed = vehicleSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() })
    return
  }

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id as string },
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        year: parsed.data.year,
        doors: parsed.data.doors,
        seats: parsed.data.seats,
        transmission: parsed.data.transmission,
        fuel: parsed.data.fuel,
        hp: parsed.data.hp,
        pricePerDay: parsed.data.pricePerDay,
        currency: parsed.data.currency,
        image: parsed.data.image,
        images: parsed.data.images,
        features: parsed.data.features,
        available: parsed.data.available,
      },
    })
    res.json(vehicle)
  } catch (err) {
    console.error('Failed to update vehicle:', err)
    res.status(500).json({ error: 'Failed to update vehicle' })
  }
})

// DELETE /api/vehicles/:id (admin)
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.vehicle.delete({ where: { id: req.params.id as string } })
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to delete vehicle:', err)
    res.status(500).json({ error: 'Failed to delete vehicle' })
  }
})

export default router
