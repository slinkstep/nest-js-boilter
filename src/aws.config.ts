import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SSM } from '@aws-sdk/client-ssm';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AwsConfig {
	private readonly ssm: SSM;
	private readonly subject: BehaviorSubject<Record<string, any>>;

	constructor(private readonly configService: ConfigService) {
		this.ssm = new SSM({
			region: 'us-east-1'
		});

		this.subject = new BehaviorSubject<Record<string, any>>({});

		this.load();
	}

	get updates$() {
		return this.subject.asObservable();
	}

	private async load() {
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

		this.subject.next(fullConfig);
	}
}

export const awsConfigFactory = (configService: ConfigService) => ({
    useFactory: () => new AwsConfig(configService),
    inject: [ConfigService],
  });

// export const awsConfigFactory = async (configService: ConfigService): Promise<AwsConfig> => {
// 	const awsConfig = new AwsConfig(configService);
// 	await awsConfig.updates$.toPromise();
// 	return awsConfig;
// };

// export const awsConfigFactory = (configService: ConfigService) => ({
// 	useFactory: () => new AwsConfig(configService),
// 	inject: [ ConfigService ]
// });
