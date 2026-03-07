import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'
import { generateSignature } from '../services/cloudinary'

const router = Router()

// POST /api/upload/signature (admin) — generate signed Cloudinary upload params
router.post('/signature', requireAuth, (_req: Request, res: Response): void => {
  try {
    const params = generateSignature()
    res.json(params)
  } catch (err) {
    console.error('Failed to generate upload signature:', err)
    res.status(500).json({ error: 'Failed to generate upload signature' })
  }
})

export default router
