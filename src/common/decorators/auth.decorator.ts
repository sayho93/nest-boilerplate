import { SetMetadata } from '@nestjs/common';
import { BYPASS_AUTH } from '../constants/auth.constant';

export const BypassAuth = () => SetMetadata(BYPASS_AUTH, true);
