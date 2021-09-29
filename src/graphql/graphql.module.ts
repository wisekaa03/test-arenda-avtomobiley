import { Module } from '@nestjs/common';
import { GraphQLModule, registerEnumType } from '@nestjs/graphql';
import { GraphqlResolver } from './graphql.resolver';
import { GraphqlService } from './graphql.service';
import { Tariff, StatisticsBy } from './models/enums.model';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: async () => {
        registerEnumType(Tariff, {
          name: 'Traif',
          description: 'Тариф',
          valuesMap: {
            first: {
              description: '270 ₽ в день за 200 км в день',
            },
            second: {
              description: '330 ₽ в день за 350 км в день',
            },
            third: {
              description: '390 ₽ в день за 500 км в день',
            },
          },
        });

        registerEnumType(StatisticsBy, {
          name: 'StatisticsBy',
          description: 'Какой отчет формировать',
          valuesMap: {
            day: {
              description: 'средняя загрузка автомобилей по дням',
            },
            auto: {
              description: 'по каждому авто',
            },
            allAutos: {
              description: 'по всем автомобилям',
            },
          },
        });

        return {
          debug: process.env.NODE_ENV !== 'production',
          playground: process.env.NODE_ENV !== 'production',
          autoSchemaFile: true,
          buildSchemaOptions: {
            dateScalarMode: 'isoDate',
          },
        };
      },
    }),
  ],

  providers: [GraphqlResolver, GraphqlService],
})
export class GraphqlModule {}
