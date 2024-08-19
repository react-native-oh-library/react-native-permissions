import NativeModule from './NativePermissionsModule';
import type { Contract } from './contract';
import type { LocationAccuracy, NotificationOption, NotificationsResponse, Permission, PermissionStatus } from './types';
/**
 * 检查单个权限的授权状态
 * */
function check(permission: Permission): Promise<PermissionStatus> {
    return NativeModule.check(permission) as Promise<PermissionStatus>;
}

/**
 * 检查多个权限的授权状态
 * */
async function checkMultiple<P extends Permission[]>(permissions: P): Promise<Record<P[number], PermissionStatus>> {
    return await NativeModule.checkMultiple(permissions) as Promise<Record<P[number], PermissionStatus>>
}

/**
 * 请求权限
*/
async function request(permission: Permission): Promise<PermissionStatus> {
    // 返回权限状态
    return NativeModule.request(permission) as Promise<PermissionStatus>;
}

/**
 * 请求多个权限
*/
async function requestMultiple<P extends Permission[]>(permissions: P): Promise<Record<P[number], PermissionStatus>> {
    return await NativeModule.requestMultiple(permissions) as Promise<Record<P[number], PermissionStatus>>;
}

/**
 * 检查通知权限的状态
*/
export function checkNotifications(): Promise<NotificationsResponse> {
    return NativeModule.checkNotifications() as Promise<NotificationsResponse>;
}

/**
 * 用于请求通知权限
*/
export function requestNotifications(options: NotificationOption[]): Promise<NotificationsResponse> {
    return NativeModule.requestNotifications(options) as Promise<NotificationsResponse>;
}

/**
 * 用来打开设置页面引导用户到设置页面开启或关闭某些权限
*/
async function openSettings(): Promise<void> {
     NativeModule.openSettings();
}

/**
 * 检查设备位置权限
*/
async function checkLocationAccuracy(): Promise<LocationAccuracy> {
    return new Promise((_resolve, reject) => {
        reject('checkLocationAccuracy is not supported on Harmony')
    })
}

/**
 * 设置设备位置权限
*/
async function requestLocationAccuracy(): Promise<LocationAccuracy> {
    return new Promise((_resolve, reject) => {
        reject('requestLocationAccuracy is not supported on Harmony')
    })
}

/**
 * 请求访问设备相册图片权限
*/
async function openPhotoPicker(): Promise<void> {
    NativeModule.openPhotoPicker()
}

export const methods: Contract = {
    checkLocationAccuracy,
    openPhotoPicker,
    requestLocationAccuracy,
    check,
    checkMultiple,
    checkNotifications,
    openSettings,
    request,
    requestMultiple,
    requestNotifications,
};