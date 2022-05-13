import { config } from 'dotenv-safe';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appInfo = require('../package.json');

export const ROOT_DIR = join(__dirname, '..');

const { parsed } = config({
    allowEmptyValues: false,
    path: join(ROOT_DIR, '.env'),
    sample: join(ROOT_DIR, '.env.example'),
});

export default {
    appVersion: appInfo.version,
    appName: parsed.APP_NAME,
    env: parsed.APP_ENV,
    appHost: parsed.APP_HOST,
    appPort: parsed.APP_PORT,
    get baseUrl() {
        return `http://${this.appHost}:${this.appPort}`;
    },
};
