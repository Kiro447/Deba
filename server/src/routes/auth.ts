import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { loginSchema } from '../lib/validation'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input' })
    return
  }

  const { username, password } = parsed.data

  if (username !== ADMIN_USERNAME) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token, success: true })
})

// POST /api/auth/logout (stateless — client removes token)
router.post('/logout', (_req: Request, res: Response): void => {
  res.json({ success: true })
})

// GET /api/auth/verify
router.get('/verify', requireAuth, (req: AuthRequest, res: Response): void => {
  res.json({ valid: true, username: req.admin?.username })
})

export default router
