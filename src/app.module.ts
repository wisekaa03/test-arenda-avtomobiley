import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphqlModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    DbModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        database: configService.get<string>('DB_DATABASE'),
        user: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
      }),
    }),

    GraphqlModule,
  ],
})
export class AppModule {}
