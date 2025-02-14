import { DEFAULT_PLATFORM } from "../constants/platform";

export const getPlatform = (headers) => {
    return headers?.platform ?? DEFAULT_PLATFORM;
}