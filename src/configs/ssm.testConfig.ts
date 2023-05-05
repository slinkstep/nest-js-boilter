import { SSM } from '@aws-sdk/client-ssm';
import { ConfigFactory } from '@nestjs/config';

const AWS_REGION = 'us-east-1';

export const awsConfigFactoryTest: ConfigFactory = async () => {
	const ssm = new SSM({ region: AWS_REGION });

	const parameters = [ 'AuthSecret' ];

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
		...fullConfig
	};
};
