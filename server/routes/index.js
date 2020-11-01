/**
 * Router instance.
 * @public
 */
import { Router } from 'express'
const router = Router()

/**
 * Generic placeholder routes.
 * @public
 */

router.get('/', (_req, res, _next) =>  {
  res.render('index', { title: 'Welcome' })
})

export default router