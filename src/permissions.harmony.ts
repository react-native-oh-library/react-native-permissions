import { AndroidPermissionMap } from './permissions.android';
import type { IOSPermissionMap } from './permissions.ios';
import type { WindowsPermissionMap } from './permissions.windows';

const HARMONY = Object.freeze({
  LOCATION_IN_BACKGROUND: 'ohos.permission.LOCATION_IN_BACKGROUND',
  LOCATION: 'ohos.permission.LOCATION',
  APPROXIMATELY_LOCATION: 'ohos.permission.APPROXIMATELY_LOCATION',
  CAMERA: 'ohos.permission.CAMERA',
  MICROPHONE: 'ohos.permission.MICROPHONE',
  READ_CALENDAR: 'ohos.permission.READ_CALENDAR',
  WRITE_CALENDAR: 'ohos.permission.WRITE_CALENDAR',
  READ_WHOLE_CALENDAR: 'ohos.permission.READ_WHOLE_CALENDAR',
  WRITE_WHOLE_CALENDAR: 'ohos.permission.WRITE_WHOLE_CALENDAR',
  ACTIVITY_MOTION: 'ohos.permission.ACTIVITY_MOTION',
  READ_HEALTH_DATA: 'ohos.permission.READ_HEALTH_DATA',
  DISTRIBUTED_DATASYNC: 'ohos.permission.DISTRIBUTED_DATASYNC',
  ANSWER_CALL: 'ohos.permission.ANSWER_CALL',
  MANAGE_VOICEMAIL: 'ohos.permission.MANAGE_VOICEMAIL',
  READ_CONTACTS: 'ohos.permission.READ_CONTACTS',
  WRITE_CONTACTS: 'ohos.permission.WRITE_CONTACTS',
  READ_CALL_LOG: 'ohos.permission.READ_CALL_LOG',
  WRITE_CALL_LOG: 'ohos.permission.WRITE_CALL_LOG',
  READ_CELL_MESSAGES: 'ohos.permission.READ_CELL_MESSAGES',
  READ_MESSAGES: 'ohos.permission.READ_MESSAGES',
  RECEIVE_MMS: 'ohos.permission.RECEIVE_MMS',
  RECEIVE_SMS: 'ohos.permission.RECEIVE_SMS',
  RECEIVE_WAP_MESSAGES: 'ohos.permission.RECEIVE_WAP_MESSAGES',
  SEND_MESSAGES: 'ohos.permission.SEND_MESSAGES',
  WRITE_AUDIO: 'ohos.permission.WRITE_AUDIO',
  READ_AUDIO: 'ohos.permission.READ_AUDIO',
  READ_DOCUMENT: 'ohos.permission.READ_DOCUMENT',
  WRITE_DOCUMENT: 'ohos.permission.WRITE_DOCUMENT',
  READ_MEDIA: 'ohos.permission.READ_MEDIA',
  WRITE_MEDIA: 'ohos.permission.WRITE_MEDIA',
  WRITE_IMAGEVIDEO: 'ohos.permission.WRITE_IMAGEVIDEO',
  READ_IMAGEVIDEO: 'ohos.permission.READ_IMAGEVIDEO',
  MEDIA_LOCATION: 'ohos.permission.MEDIA_LOCATION',
  APP_TRACKING_CONSENT: 'ohos.permission.APP_TRACKING_CONSENT',
  GET_INSTALLED_BUNDLE_LIST: 'ohos.permission.GET_INSTALLED_BUNDLE_LIST',
  ACCESS_BLUETOOTH: 'ohos.permission.ACCESS_BLUETOOTH'
} as const);

export type HarmonyPermissionMap = typeof HARMONY;

export const PERMISSIONS = Object.freeze({
  HARMONY,
  ANDROID: {} as AndroidPermissionMap,
  IOS: {} as IOSPermissionMap,
  WINDOWS: {} as WindowsPermissionMap,
} as const);
