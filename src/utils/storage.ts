import { supabase } from './supabase'
import type { Car } from '../data/cars'

function rowToCar(row: Record<string, unknown>): Car {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as Car['category'],
    year: row.year as number,
    doors: row.doors as number,
    seats: row.seats as number,
    transmission: row.transmission as Car['transmission'],
    fuel: row.fuel as Car['fuel'],
    hp: row.hp as number,
    pricePerDay: row.price_per_day as number,
    currency: row.currency as string,
    image: row.image as string,
    features: row.features as string[],
    available: row.available as boolean,
  }
}

function carToRow(car: Car) {
  return {
    id: car.id,
    name: car.name,
    category: car.category,
    year: car.year,
    doors: car.doors,
    seats: car.seats,
    transmission: car.transmission,
    fuel: car.fuel,
    hp: car.hp,
    price_per_day: car.pricePerDay,
    currency: car.currency,
    image: car.image,
    features: car.features,
    available: car.available,
  }
}

export async function getVehicles(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at')
  if (error || !data) return []
  return data.map(rowToCar)
}

export async function addVehicle(car: Car): Promise<void> {
  await supabase.from('vehicles').insert(carToRow(car))
}

export async function updateVehicle(car: Car): Promise<void> {
  const { id, ...fields } = carToRow(car)
  await supabase.from('vehicles').update(fields).eq('id', id)
}

export async function deleteVehicle(id: string): Promise<void> {
  await supabase.from('vehicles').delete().eq('id', id)
}

/* ── Reservations ── */

export interface Reservation {
  id: string
  vehicleId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupDate: string
  returnDate: string
  notes: string
  status: 'new' | 'confirmed' | 'cancelled'
  createdAt: string
  vehicleName?: string
}

function rowToReservation(row: Record<string, unknown>): Reservation {
  const vehicle = row.vehicles as Record<string, unknown> | null
  return {
    id: row.id as string,
    vehicleId: row.vehicle_id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    phone: row.phone as string,
    pickupDate: row.pickup_date as string,
    returnDate: row.return_date as string,
    notes: (row.notes as string) ?? '',
    status: row.status as Reservation['status'],
    createdAt: row.created_at as string,
    vehicleName: vehicle ? (vehicle.name as string) : undefined,
  }
}

export async function createReservation(data: {
  vehicleId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  pickupDate: string
  returnDate: string
  notes: string
}): Promise<void> {
  const { error } = await supabase.from('reservations').insert({
    vehicle_id: data.vehicleId,
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    pickup_date: data.pickupDate,
    return_date: data.returnDate,
    notes: data.notes,
  })
  if (error) throw error
}

export async function getReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, vehicles(name)')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map(rowToReservation)
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['status'],
): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}
