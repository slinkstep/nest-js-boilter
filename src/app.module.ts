import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsConfig, awsConfigFactory } from './aws.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { awsConfigFactoryNew } from './configs/ssm.config';
import { awsConfigFactoryTest } from './configs/ssm.testConfig';
import { getDbConfig } from './configs/dbConfig';
import { SsmService } from './configs/getSSMConfig';
import { typeOrmConfig } from './configs/typeORMConfig';

const srcDir = path.join(__dirname, '..');

@Module({
	imports: [
		// ConfigModule.forRoot({
		//   isGlobal: true,
		//   cache: true,
		//   load: [async () => awsConfigFactory(new ConfigService())],
		// }),

		// ConfigModule.forRoot({
		// 	isGlobal: true,
		// 	load: [async () => {
		// 	  const ssmService = new SsmService();
		// 	  const env = await ssmService.loadParameters();
	  
		// 	  return env;
		// 	}],
		//   }),

		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [ awsConfigFactoryTest ]
		}),

		// TypeOrmModule.forRootAsync({

		// 	imports: [ ConfigModule ],
		// 	useFactory: async (configService: ConfigService) => {
		// 		let host = await configService.get<string>('MainDatabaseHost');
		// 		let port = await configService.get<number>('MainDatabasePort');
		// 		let username = await configService.get<string>('MainDatabaseUser');
		// 		let password = await configService.get<string>('MainDatabasePassword');
		// 		let database = await configService.get<string>('MainDatabaseName');

		//     console.log("host",host)
		//     console.log("port",port)
		//     console.log("username",username)
		//     console.log("password",password)
		//     console.log("database",database)

		// 		return {
		// 			// name: 'mysqlWriteConnection',
		// 			type: 'mysql',
		// 			host: host,
		// 			port: port,
		// 			username: username,
		// 			password: password,
		// 			database: database,
		// 			// host: 'greenrundb.cluster-ccr2qejiwhbr.us-east-1.rds.amazonaws.com',
		// 			// port: 3306,
		// 			// username: 'GreenrunRdsDev',
		// 			// password: 'dev*2021greenrun*Rds',
		// 			// database: 'greenrun-dev',
		// 			// entities: [ srcDir + '/**/*.entity{.ts,.js}' ],
		// 			synchronize: false
		// 		};
		// 	},
		// 	inject: [ ConfigService ]
		// }),

		TypeOrmModule.forRootAsync({
			useFactory: async () => await getDbConfig()
		})

		// TypeOrmModule.forRootAsync({
		// 	imports: [ConfigModule],
		// 	useFactory: typeOrmConfig,
		// 	inject: [ConfigService],
		//   }),
	],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule {}
