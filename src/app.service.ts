import { Injectable } from '@nestjs/common';
import config from './config';

@Injectable()
export class AppService {
    ping(): string {
        return config.appName;
    }
}
