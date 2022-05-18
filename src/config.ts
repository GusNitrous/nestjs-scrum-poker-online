import { config } from 'dotenv-safe';
import { join } from 'path';

export const ROOT_DIR = join(__dirname, '..');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appInfo = require(join(ROOT_DIR, 'package.json'));

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
    baseUrl: parsed.BASE_URL,
    get jwtSecret(): string {
        return parsed.JWT_SECRET;
    },
};
