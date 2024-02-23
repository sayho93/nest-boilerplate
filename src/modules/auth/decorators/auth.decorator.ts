import { SetMetadata } from '@nestjs/common';
import { BYPASS_AUTH } from '../auth.constant';

export const BypassAuth = () => SetMetadata(BYPASS_AUTH, true);
