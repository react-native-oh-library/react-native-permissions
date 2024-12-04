import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { abilityAccessCtrl, bundleManager, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import notificationManager from '@ohos.notificationManager';
import Base from '@ohos.base';
import { GrantStatus, NotificationsResponse } from './results';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import log from './Logger';

export class PermissionsModule extends TurboModule {
  /**
   * 检查单个权限的授权状态
   * */
  async check(permission: Permissions): Promise<string> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();

    // 获取应用程序的accessTokenID
    let tokenId: number = await this.getTokenId();

    // 检查权限
    try {
      return this.getCheckGrantStatus(await atManager.checkAccessToken(tokenId, permission));
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
      return `Failed to check access token. Code is ${err.code}, message is ${err.message}`;
    }
  }

  /**
   * 检查多个权限的授权状态
   * */
  async checkMultiple(permissions: Array<Permissions>): Promise<Object> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: Record<string, GrantStatus> = {};

    // 获取应用程序的accessTokenID
    let tokenId: number = await this.getTokenId();
    for (let index = 0; index < permissions.length; index++) {
      // 校验应用是否被授予权限
      try {
        const Status = await atManager.checkAccessToken(tokenId, permissions[index]);
        grantStatus[permissions[index]] = this.getCheckGrantStatus(Status);
      } catch (error) {
        let err: BusinessError = error as BusinessError;
        log.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
        return `Failed to check access token. Code is ${err.code}, message is ${err.message}`;
      }
    }
    return grantStatus;
  }

  /**
   * 请求权限
   */
  async request(permissions: Permissions): Promise<string> {
    let grantStatus: string = await this.check(permissions);
    if (grantStatus === GrantStatus.PERMISSION_GRANTED) {
      // 已经授权，可以继续访问目标操作
      return grantStatus;
    } else {
      // 未授权，申请权限
      let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
      try {
        let context = this.ctx.uiAbilityContext;
        const resultData = await atManager.requestPermissionsFromUser(context, [permissions]);
        return this.getRequestGrantStatus(resultData.authResults[0], resultData.dialogShownResults[0]);
      } catch (err) {
        let target: BusinessError = err as BusinessError;
        log.error(`request, request permission failed, error code: ${target.code}`);
        return `request catch err->${JSON.stringify(err)}`;
      }
    }
  }

  /**
   * 请求多个权限
   */
  async requestMultiple(permissions: Array<Permissions>): Promise<Object> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let resultsStatus: Record<string, GrantStatus> = {};
    try {
      let context = this.ctx.uiAbilityContext;
      const resultData = await atManager.requestPermissionsFromUser(context, permissions)
      for (let index = 0; index < resultData.authResults.length; index++) {
        const status = this.getRequestGrantStatus(resultData.authResults[index], resultData.dialogShownResults[index]);
        resultsStatus[permissions[index]] = status;
      }
      return resultsStatus;
    } catch (err) {
      let target: BusinessError = err as BusinessError;
      log.error(`requestMultiple, request permissions failed, error code: ${target.code}`);
      return `requestMultiple catch err->${JSON.stringify(err)}`;
    }
  }

  /**
   * 应用请求通知使能
   * */
  requestNotifications(): Promise<NotificationsResponse> {
    return new Promise((resolve, reject) => {
      notificationManager.requestEnableNotification().then(() => {
        resolve({
          status: GrantStatus.PERMISSION_GRANTED,
          settings: {}
        });
      }).catch((err: Base.BusinessError) => {
        reject(err);
      });
    })
  }

  /**
   * 应用查询通知使能
   * */
  checkNotifications() {
    return new Promise((resolve, reject) => {
      notificationManager.isNotificationEnabled().then((data: boolean) => {
        resolve({
          status: data ? GrantStatus.PERMISSION_GRANTED : GrantStatus.PERMISSION_BLOCKED,
          settings: {}
        });
      }).catch((err: Base.BusinessError) => {
        reject(err);
      });
    })
  }

  /**
   * 用来打开设置页面引导用户到设置页面开启或关闭某些权限
   * */
  async openSettings(): Promise<void> {
    let context = this.ctx.uiAbilityContext;
    let want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility'
    };
    try {
      await context.startAbility(want);
    } catch (e) {
      log.error(`openSettings, start ability failed, error code ${(e as BusinessError).code}`)
    }
  }

  /**
   * 用来打开图片选择
   * */
  async openPhotoPicker() {
    try {
      let PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      PhotoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
      PhotoSelectOptions.maxSelectNumber = 5;
      let photoPicker = new photoAccessHelper.PhotoViewPicker();
      photoPicker.select(PhotoSelectOptions).then((PhotoSelectResult: photoAccessHelper.PhotoSelectResult) => {
      }).catch((err: BusinessError) => {
        log.error(`openPhotoPicker, PhotoViewPicker.select failed with err: ${err.code}`);
      });
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`openPhotoPicker, PhotoViewPicker failed with err: ${err.code}`);
    }
  }

  private getCheckGrantStatus(status: number): GrantStatus {
    let resultStatus: GrantStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    if (status === -1) {
      resultStatus = GrantStatus.PERMISSION_DENIED;
    } else if (status === 0) {
      resultStatus = GrantStatus.PERMISSION_GRANTED;
    } else {
      log.warn(`getCheckGrantStatus, grantStatus unknown, status: ${status}}`);
    }
    return resultStatus;
  }

  private getRequestGrantStatus(status: number, dialogShownResult: boolean = true): GrantStatus {
    let resultStatus: GrantStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    if (status === -1) {
      resultStatus = dialogShownResult ? GrantStatus.PERMISSION_DENIED : GrantStatus.PERMISSION_BLOCKED;
    } else if (status === 0) {
      resultStatus = GrantStatus.PERMISSION_GRANTED;
    } else if (status === 2) {
      resultStatus = GrantStatus.PERMISSION_UNAVAILABLE;
    } else {
      log.warn(`getRequestGrantStatus, grantStatus unknown, status: ${status}}`);
    }
    return resultStatus;
  }

  private async getTokenId(): Promise<number> {
    try {
      let bundleInfo: bundleManager.BundleInfo =
        await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      return appInfo.accessTokenId;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      log.error(`getTokenId, get tokenId failed, error code: ${err.message}`);
      return -1;
    }
  }
}
