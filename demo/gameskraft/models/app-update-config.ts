export default interface AppUpdateConfig {
    isUpdateAvailable: boolean,
    updateType?: number,
    updateMode?: number,
    updateUrl?: string,
    canSyncCodePush?: boolean,
    codePushSyncConfig?: CodePushSyncConfig,
}

export interface CodePushSyncConfig {
    installMode: number,
    mandatoryInstallMode: number,
    minimumBackgroundDuration: number,
    rollbackRetryOptions: CodePushRollBackRetryOptions
}

export interface CodePushRollBackRetryOptions {
    delayInHours: number,
    maxRetryAttempts: number,
}
