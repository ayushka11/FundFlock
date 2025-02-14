import {Namespace} from 'cls-hooked';
import {CASH_APP, CLS} from '../constants/constants';

class ClsUtil {
  static requestNamespace: Namespace | undefined = undefined;

  static initNS(ns: Namespace): void {
    this.requestNamespace = ns;
  }

  static getNS(): Namespace | undefined {
    return this.requestNamespace;
  }

  static addSessionIdToRequestNS(sessionId: string): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [sessionId-${sessionId}] `,
      );
    } catch (e) {
      // TODO Add logging & monitoring
    }
  }

  static addDeviceIdToRequestNS(deviceId: string): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [deviceId-${deviceId}] `,
      );
    } catch (e) {
    }
  }

  static addRequestIdToRequestNS(requestId: any): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue}[${requestId}]`,
      );
    } catch (e) {
    }
  }

  static addUserIdToRequestNS(userId: any): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [user-${userId}]`,
      );
    } catch (e) {
    }
  }

  static addVendorIdToRequestNS(vendorId: any): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [vendor-${vendorId}]`,
      );
    } catch (e) {
    }
  }

  static addPlatformToRequestNS(platform: any): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [platform-${platform}]`,
      );
    } catch (e) {
    }
  }

  static addAppVersionToRequestNS(appVersion: any): void {
    try {
      const previousValue: string =
          this.requestNamespace?.get(CLS.requestInfoKey) || '';
      this.requestNamespace?.set(
          CLS.requestInfoKey,
          `${previousValue} [appVersion-${appVersion}]`,
      );
    } catch (e) {
    }
  }

  static setAppTypeToNS(appType : string) :void{
		this.requestNamespace?.set(
			CLS.appType,
			appType,
		);
	}

  static getRequestInfo(): string {
    try {
      return this.requestNamespace?.get(CLS.requestInfoKey) || '';
    } catch (e) {
      // TODO Add logging & monitoring
      return ''
    }
  }

  static getAppType(): string {
		return this.requestNamespace?.get(CLS.appType) || CASH_APP;
	}
}

export default ClsUtil;
