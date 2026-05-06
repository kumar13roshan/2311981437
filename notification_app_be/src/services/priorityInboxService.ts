import axios from 'axios';
import { authenticate, Log } from 'affordmed-logging-middleware';
import { env } from '../config/env';
import { PRIORITY_WEIGHTS } from '../constants/notificationTypes';
import type { ExternalNotification, Notification, PriorityNotification } from '../types/notification';
import { MinHeap } from './priorityQueue';

const defaultPriorityLimit = 10;
const minimumPriorityLimit = 1;
const maximumPriorityLimit = 50;
const externalRequestTimeoutMs = 5000;
const millisecondsPerHour = 3_600_000;
const recencyBaseScore = 50;
const defaultTypeWeight = 10;

const normalizeNotification = (item: ExternalNotification, index: number): Notification => ({
  id: String(item.id ?? `external-${index}`),
  title: item.title || 'Notification',
  message: item.message || '',
  type: (item.type || 'Event') as Notification['type'],
  studentID: item.studentID ?? item.studentId,
  createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
  read: Boolean(item.read ?? item.isRead ?? false),
});

const recencyScore = (createdAt: string): number => {
  const ageHours = Math.max((Date.now() - new Date(createdAt).getTime()) / millisecondsPerHour, 0);
  return Math.max(0, recencyBaseScore - ageHours);
};

export const scoreNotification = (notification: Notification): number => {
  const typeWeight = PRIORITY_WEIGHTS[notification.type] ?? defaultTypeWeight;
  return Number((typeWeight + recencyScore(notification.createdAt)).toFixed(3));
};

export const priorityInboxService = {
  async fetchPriorityInbox(limit = defaultPriorityLimit): Promise<PriorityNotification[]> {
    const topN = Math.min(Math.max(limit, minimumPriorityLimit), maximumPriorityLimit);
    const token = await authenticate();

    const response = await axios.get(`${env.evaluationBaseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: externalRequestTimeoutMs,
    });

    const rawNotifications: ExternalNotification[] = Array.isArray(response.data)
      ? response.data
      : response.data?.notifications || response.data?.data || [];

    const heap = new MinHeap<PriorityNotification>((item) => item.score);

    rawNotifications.forEach((raw, index) => {
      const notification = normalizeNotification(raw, index);
      if (notification.read) return;

      const candidate: PriorityNotification = {
        ...notification,
        score: scoreNotification(notification),
        rank: 0,
      };

      if (heap.size() < topN) {
        heap.push(candidate);
      } else if (heap.peek() && candidate.score > heap.peek()!.score) {
        heap.replaceRoot(candidate);
      }
    });

    const ranked = heap.toSortedDesc().map((item, index) => ({ ...item, rank: index + 1 }));
    await Log('backend', 'info', 'service', `Priority inbox generated count=${ranked.length}`);
    return ranked;
  },
};
