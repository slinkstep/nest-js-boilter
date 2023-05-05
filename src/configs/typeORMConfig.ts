import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
	type: 'mysql',
	entities: [ __dirname + '/../**/*.entity.{js,ts}' ],
	synchronize: false,
	replication: {
		master: {
			host: configService.get('MainDatabaseHost'),
			port: Number(configService.get('MainDatabasePort')),
			username: configService.get('MainDatabaseUser'),
			password: configService.get('MainDatabasePassword'),
            database: configService.get('MainDatabaseName'),
		},
		slaves: [
			{
                host: configService.get['MainDatabaseHostRead'],
                port: Number(configService.get['MainDatabasePortRead']),
                username: configService.get['MainDatabaseUserRead'],
                password: configService.get['MainDatabasePasswordRead'],
                database: configService.get['MainDatabaseNameRead']
			}
		]
	}
});
