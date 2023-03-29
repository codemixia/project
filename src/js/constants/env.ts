import { CONFIG_TYPE } from '_models/global';

const { env = {} } = (process.env.CONFIG as unknown as CONFIG_TYPE) || {};

export default {
    API_URL: env.apiURL || '',
};
