import { NOTIFICATION_TYPES } from '../constants/notificationTypes';
import { AppError } from '../utils/AppError';
import type { NotificationType } from '../types/notification';

const minimumTitleLength = 3;
const minimumMessageLength = 5;
const firstPage = 1;
const defaultLimit = 10;
const maxLimit = 100;

export const validateCreateNotification = (body: any): { title: string; message: string; type: NotificationType } => {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') errors.push('request body is required');
  if (typeof body?.title !== 'string' || body.title.trim().length < minimumTitleLength) {
    errors.push(`title must be at least ${minimumTitleLength} characters`);
  }
  if (typeof body?.message !== 'string' || body.message.trim().length < minimumMessageLength) {
    errors.push(`message must be at least ${minimumMessageLength} characters`);
  }
  if (!NOTIFICATION_TYPES.includes(body?.type)) errors.push(`type must be one of ${NOTIFICATION_TYPES.join(', ')}`);

  if (errors.length > 0) throw new AppError('Validation error', 400, errors);

  return {
    title: body.title.trim(),
    message: body.message.trim(),
    type: body.type,
  };
};

export const validatePagination = (query: any) => {
  const page = Math.max(Number(query.page || firstPage), firstPage);
  const limit = Math.min(Math.max(Number(query.limit || defaultLimit), firstPage), maxLimit);
  const sort: 'asc' | 'desc' = query.sort === 'asc' ? 'asc' : 'desc';
  const read = query.read === undefined ? undefined : query.read === 'true';
  const type = typeof query.type === 'string' && query.type.trim() ? query.type.trim() : undefined;
  return { page, limit, sort, read, type };
};
