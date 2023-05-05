import { SSM } from '@aws-sdk/client-ssm';
import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export async function getDbConfig(): Promise<TypeOrmModuleOptions> {
	const ssm = new SSM({ region: 'us-east-1' });
	const srcDir = path.join(__dirname, '..');

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
		'MainDatabaseUserRead'
	];

	const readLimit = 10;
	let fullConfig = {};
	for (let i = 0; i < parameters.length; i += readLimit) {
		let parameterSet = parameters.slice(i, i + readLimit);

		let params = {
			Names: [ ...parameterSet ],
			WithDecryption: true
		};

		let response = await ssm.getParameters(params);

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

	console.log('fullconfig', fullConfig);

	return {
		type: 'mysql',
		entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
		synchronize: false,
		replication: {
			master: {
				host: fullConfig['MainDatabaseHost'],
				port: parseInt(fullConfig['MainDatabasePort'], 10),
				username: fullConfig['MainDatabaseUser'],
				password: fullConfig['MainDatabasePassword'],
				database: fullConfig['MainDatabaseName']
			},
			slaves: [
				{
					host: fullConfig['MainDatabaseHostRead'],
					port: parseInt(fullConfig['MainDatabasePortRead'], 10),
					username: fullConfig['MainDatabaseUserRead'],
					password: fullConfig['MainDatabasePasswordRead'],
					database: fullConfig['MainDatabaseNameRead']
				}
				// Add more slaves if needed
			]
		},

	};
}
