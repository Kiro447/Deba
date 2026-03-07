import { api } from './api'
import type { Car } from '../data/cars'

export async function getVehicles(): Promise<Car[]> {
  try {
    return await api.get<Car[]>('/api/vehicles')
  } catch {
    return []
  }
}

export async function addVehicle(car: Car): Promise<void> {
  await api.post('/api/vehicles', car)
}

export async function updateVehicle(car: Car): Promise<void> {
  await api.put(`/api/vehicles/${car.id}`, car)
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/api/vehicles/${id}`)
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
  await api.post('/api/reservations', data)
}

export async function getReservations(): Promise<Reservation[]> {
  try {
    return await api.get<Reservation[]>('/api/reservations')
  } catch {
    return []
  }
}

export async function updateReservationStatus(
  id: string,
  status: Reservation['status'],
): Promise<void> {
  await api.put(`/api/reservations/${id}/status`, { status })
}
