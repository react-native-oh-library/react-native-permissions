import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { abilityAccessCtrl, bundleManager, Permissions } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import notificationManager from '@ohos.notificationManager';
import Base from '@ohos.base';
import { GrantStatus, NotificationsResponse } from './results';
import { photoAccessHelper } from '@kit.MediaLibraryKit';

export class PermissionsModule extends TurboModule {
  /**
   * 检查单个权限的授权状态
   * */
  async check(permission: Permissions): Promise<string> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: abilityAccessCtrl.GrantStatus = abilityAccessCtrl.GrantStatus.PERMISSION_DENIED;
    let resultsStatus: GrantStatus = GrantStatus.PERMISSION_BLOCKED;
    // 获取应用程序的accessTokenID
    let tokenId: number = 0;
    try {
      let bundleInfo: bundleManager.BundleInfo = await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`);
      return `Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`;
    }
    // 校验应用是否被授予权限
    try {
      grantStatus = await atManager.checkAccessToken(tokenId, permission);
      resultsStatus = grantStatus === -1 ? GrantStatus.PERMISSION_BLOCKED : grantStatus === 0 ? GrantStatus.PERMISSION_GRANTED : GrantStatus.PERMISSION_UNAVAILABLE;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
      return `Failed to check access token. Code is ${err.code}, message is ${err.message}`;
    }
    return resultsStatus;
  }
  /**
   * 检查多个权限的授权状态
   * */
  async checkMultiple(permissions: Array<Permissions>): Promise<Object> {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: Record<string, GrantStatus> = {};
    // 获取应用程序的accessTokenID
    let tokenId: number = 0;
    try {
      let bundleInfo: bundleManager.BundleInfo = await bundleManager.getBundleInfoForSelf(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`);
      return `Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`
    }
    for (let index = 0; index < permissions.length; index++) {
      // 校验应用是否被授予权限
      try {
        const Status = await atManager.checkAccessToken(tokenId, permissions[index]);
        grantStatus[permissions[index]] = this.checkStatus(Status);
      } catch (error) {
        let err: BusinessError = error as BusinessError;
        console.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
        return `Failed to check access token. Code is ${err.code}, message is ${err.message}`
      }
    }
    return grantStatus;
  }

  /**
   * 请求权限
   */
  async request(permissions: Permissions): Promise<string> {
    let grantStatus: string = await this.check(permissions);
    let resultsStatus: GrantStatus = GrantStatus.PERMISSION_BLOCKED;
    if (grantStatus === GrantStatus.PERMISSION_GRANTED) {
      // 已经授权，可以继续访问目标操作
      return grantStatus;
    } else {
      // 未授权，申请权限
      let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
      try {
        let context = this.ctx.uiAbilityContext;
        const resultData = await atManager.requestPermissionsFromUser(context, [permissions])
        resultsStatus = this.checkStatus(resultData.authResults[0])
        return resultsStatus;
      } catch (err) {
        console.error(`catch err->${JSON.stringify(err)}`);
        return `catch err->${JSON.stringify(err)}`;
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
        const status = this.checkStatus(resultData.authResults[index]);
        resultsStatus[permissions[index]] = status;
      }
      return resultsStatus;
    } catch (err) {
      console.error(`catch err->${JSON.stringify(err)}`);
      return `catch err->${JSON.stringify(err)}`;
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
        })
      }).catch((err: Base.BusinessError) => {
        reject(err)
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
        })
      }).catch((err: Base.BusinessError) => {
        reject(err)
      });
    })
  }

  /**
   * 用来打开设置页面引导用户到设置页面开启或关闭某些权限
   * */
  openSettings(): void {
    let context = this.ctx.uiAbilityContext;
    let want = {
      bundleName: 'com.huawei.hmos.settings',
      abilityName: 'com.huawei.hmos.settings.MainAbility'
    };
    context.startAbility(want)
      .then(() => {})
      .catch((err) => {
        console.error(`Failed to startAbility. Code: ${err.code}, message: ${err.message}`);
      });
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
        console.error(`PhotoViewPicker.select failed with err: ${err.code}, ${err.message}`);
      });
    } catch (error) {
      let err: BusinessError = error as BusinessError;
      console.error(`PhotoViewPicker failed with err: ${err.code}, ${err.message}`);
    }
  }

  private checkStatus(status: number): GrantStatus {
    return status === -1 ? GrantStatus.PERMISSION_BLOCKED : status === 0 ? GrantStatus.PERMISSION_GRANTED : GrantStatus.PERMISSION_UNAVAILABLE;
  }
}
