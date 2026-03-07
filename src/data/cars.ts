export type Category = 'Economy' | 'Compact' | 'SUV' | 'Luxury' | 'Van'
export type Transmission = 'Manual' | 'Automatic'
export type Fuel = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'

export interface Car {
  id: string
  name: string
  category: Category
  year: number
  doors: number
  seats: number
  transmission: Transmission
  fuel: Fuel
  hp: number
  pricePerDay: number
  currency: string
  image: string
  images: string[]
  features: string[]
  available: boolean
}

export const cars: Car[] = [
  {
    id: 'toyota-corolla-2022',
    name: 'Toyota Corolla',
    category: 'Compact',
    year: 2022,
    doors: 4,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    hp: 132,
    pricePerDay: 35,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Backup Camera', 'USB Charging', 'Cruise Control'],
    available: true,
  },
  {
    id: 'vw-golf-2021',
    name: 'Volkswagen Golf',
    category: 'Compact',
    year: 2021,
    doors: 4,
    seats: 5,
    transmission: 'Manual',
    fuel: 'Diesel',
    hp: 116,
    pricePerDay: 30,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Navigation', 'Heated Seats', 'USB Charging'],
    available: true,
  },
  {
    id: 'skoda-octavia-2023',
    name: 'Škoda Octavia',
    category: 'Compact',
    year: 2023,
    doors: 4,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    hp: 150,
    pricePerDay: 38,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Navigation', 'Parking Sensors', 'Lane Assist'],
    available: true,
  },
  {
    id: 'dacia-sandero-2022',
    name: 'Dacia Sandero',
    category: 'Economy',
    year: 2022,
    doors: 4,
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    hp: 90,
    pricePerDay: 22,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'USB Charging'],
    available: true,
  },
  {
    id: 'bmw-x3-2022',
    name: 'BMW X3',
    category: 'SUV',
    year: 2022,
    doors: 4,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    hp: 190,
    pricePerDay: 75,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Navigation', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'AWD'],
    available: true,
  },
  {
    id: 'mercedes-e-class-2023',
    name: 'Mercedes E-Class',
    category: 'Luxury',
    year: 2023,
    doors: 4,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    hp: 258,
    pricePerDay: 95,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Navigation', 'Leather Seats', 'Sunroof', 'Massaging Seats', '360 Camera'],
    available: true,
  },
  {
    id: 'vw-transporter-2021',
    name: 'VW Transporter',
    category: 'Van',
    year: 2021,
    doors: 4,
    seats: 8,
    transmission: 'Manual',
    fuel: 'Diesel',
    hp: 150,
    pricePerDay: 65,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1609520505218-7421df82d8b9?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'USB Charging', 'Large Boot'],
    available: true,
  },
  {
    id: 'toyota-rav4-2023',
    name: 'Toyota RAV4',
    category: 'SUV',
    year: 2023,
    doors: 4,
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    hp: 218,
    pricePerDay: 80,
    currency: '€',
    image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format&fit=crop',
    images: [],
    features: ['AC', 'Bluetooth', 'Navigation', 'Backup Camera', 'AWD', 'Eco Mode'],
    available: true,
  },
]

export const featuredCarIds = [
  'toyota-corolla-2022',
  'bmw-x3-2022',
  'dacia-sandero-2022',
  'toyota-rav4-2023',
]
