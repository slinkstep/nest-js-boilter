import { Injectable } from '@nestjs/common';
import { SSM } from '@aws-sdk/client-ssm';

@Injectable()
export class SsmService {
  private ssm: SSM;

  constructor() {
    this.ssm = new SSM({ region: 'us-east-1' });
  }

  async loadParameters(): Promise<Record<string, string>> {

    const parameters = [
        'MainDatabaseHost',
        'MainDatabasePassword',
        'MainDatabasePort',
        'MainDatabaseName',
        'MainDatabaseUser',
        'MainDatabaseHostRead',
        'MainDatabasePasswordRead',
        'MainDatabasePortRead',
        'MainDatabaseNameRead',
        'MainDatabaseUserRead',
        'AuthSecret'
    ];

    const readLimit = 10;
    let fullConfig = {};
    for (let i = 0; i < parameters.length; i += readLimit) {
        let parameterSet = parameters.slice(i, i + readLimit);

        let params = {
            Names: [ ...parameterSet ],
            WithDecryption: true
        };

        let response = await this.ssm.getParameters(params);

        let config = response.Parameters.reduce(
            (config, param) => ({
                ...config,
                [param.Name.split('/').pop()]: param.Value
            }),
            {}
        );

        fullConfig = {
            ...fullConfig,
            ...config
        };
    }

    return fullConfig
  }
}
