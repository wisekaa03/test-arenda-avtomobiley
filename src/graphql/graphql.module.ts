import { Module } from '@nestjs/common';
import {
  GraphQLModule,
  registerEnumType,
  createUnionType,
} from '@nestjs/graphql';
import { GraphqlResolver } from './graphql.resolver';
import { GraphqlService } from './graphql.service';
import { StatisticsBy } from './models/statistics.input.model';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: async () => {
        registerEnumType(StatisticsBy, {
          name: 'StatisticsBy',
          description: 'Какой отчет формировать',
        });

        return {
          debug: process.env.NODE_ENV !== 'production',
          playground: process.env.NODE_ENV !== 'production',
          autoSchemaFile: true,
        };
      },
    }),
  ],

  providers: [GraphqlResolver, GraphqlService],
})
export class GraphqlModule {}
