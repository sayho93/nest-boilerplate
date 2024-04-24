import { Injectable } from '@nestjs/common';
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';
import { EmailClient } from 'oci-email';
import { IdentityClient } from 'oci-identity';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class OracleMailerService {
  private readonly compartmentId;
  private readonly serviceName: string;
  private readonly regionId: string;
  private readonly secondLevelDomain: string;
  private readonly senderEmailAddress: string;

  protected readonly client: EmailClient;
  private readonly identityClient: IdentityClient;

  constructor(protected readonly loggerService: LoggerService) {
    const provider: ConfigFileAuthenticationDetailsProvider = new ConfigFileAuthenticationDetailsProvider();
    this.compartmentId = '';
    this.senderEmailAddress = 'sayho@psyho.kr';

    this.client = new EmailClient({ authenticationDetailsProvider: provider });
    this.identityClient = new IdentityClient({ authenticationDetailsProvider: provider });
  }
}
