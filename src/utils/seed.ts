import { cars } from '../data/cars'
import { setVehicles } from './storage'

const KEY = 'deba_vehicles'

export function seedVehiclesIfNeeded(): void {
  if (localStorage.getItem(KEY) === null) {
    setVehicles(cars)
  }
}
