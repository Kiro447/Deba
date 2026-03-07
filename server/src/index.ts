import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import vehicleRoutes from './routes/vehicles'
import reservationRoutes from './routes/reservations'
import uploadRoutes from './routes/upload'

const app = express()
const PORT = parseInt(process.env.PORT || '3000')
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Deba API server running on port ${PORT}`)
})

export default app
