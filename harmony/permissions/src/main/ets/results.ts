export enum GrantStatus {
  PERMISSION_BLOCKED = 'blocked',
  PERMISSION_GRANTED = 'granted',
  PERMISSION_UNAVAILABLE = 'unavailable',
}

export type NotificationsResponse = {
  status: Object;
  settings: Object;
};


