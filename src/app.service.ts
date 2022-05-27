import { Injectable } from '@nestjs/common';
import config from './config';

@Injectable()
export class AppService {
    ping(): string {
        // TODO change on Health check
        return config.appName;
    }
}
