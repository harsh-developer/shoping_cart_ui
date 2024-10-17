import { DEFAULT_APP_DATA } from './app-data';
export let platform = 'shopping_cart_dev';
let APP_DATA = DEFAULT_APP_DATA[platform];

export const DEFAULT_CONFIG = {
    appVersion: "1.0.0.0.0",
    frontEndUrl: window.location.protocol + "//" + window.location.host + "/",
    api_url: APP_DATA.ubase,
    dev_api_url: APP_DATA.dev_ubase
};
