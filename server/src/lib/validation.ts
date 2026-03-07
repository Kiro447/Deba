import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const vehicleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  category: z.enum(['Economy', 'Compact', 'SUV', 'Luxury', 'Van']),
  year: z.number().int().min(1900).max(2100),
  doors: z.number().int().min(1).max(10),
  seats: z.number().int().min(1).max(50),
  transmission: z.enum(['Manual', 'Automatic']),
  fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid']),
  hp: z.number().int().min(1),
  pricePerDay: z.number().positive(),
  currency: z.string().default('€'),
  image: z.string().url(),
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),
  available: z.boolean().default(true),
})

export const reservationSchema = z.object({
  vehicleId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  pickupDate: z.string().min(1),
  returnDate: z.string().min(1),
  notes: z.string().default(''),
})

export const statusUpdateSchema = z.object({
  status: z.enum(['new', 'confirmed', 'cancelled']),
})
