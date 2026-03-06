import type { Car } from '../data/cars'

const KEY = 'deba_vehicles'

export function getVehicles(): Car[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Car[]
  } catch {
    return []
  }
}

export function setVehicles(cars: Car[]): void {
  localStorage.setItem(KEY, JSON.stringify(cars))
}

export function addVehicle(car: Car): void {
  setVehicles([...getVehicles(), car])
}

export function updateVehicle(car: Car): void {
  setVehicles(getVehicles().map((c) => (c.id === car.id ? car : c)))
}

export function deleteVehicle(id: string): void {
  setVehicles(getVehicles().filter((c) => c.id !== id))
}
