export const NOTIFICATION_TYPES = ['Placement', 'Result', 'Event', 'info', 'success', 'warning', 'error'] as const;

export const PRIORITY_WEIGHTS: Record<string, number> = {
  Placement: 100,
  Result: 70,
  Event: 40,
  info: 20,
  success: 25,
  warning: 30,
  error: 35,
};
