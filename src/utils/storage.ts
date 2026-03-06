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
