import { Router } from 'express';
import {
  createNotification,
  deleteNotification,
  getNotifications,
  getPriorityInbox,
  markNotificationRead,
} from '../controllers/notificationController';

const router = Router();

router.get('/', getNotifications);
router.post('/', createNotification);
router.get('/priority', getPriorityInbox);
router.patch('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

export default router;
