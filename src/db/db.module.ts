import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PG_CLIENT } from './db.constants';
import { DBClientConfigAsync } from './db.interfaces';
import { DbService } from './db.service';

@Global()
@Module({})
export class DbModule {
  static registerAsync(options: DBClientConfigAsync): DynamicModule {
    const providers = this.createProviders(options);

    return {
      module: DbModule,
      imports: options.imports,
      providers,
      exports: providers,
    };
  }

  static createProviders(options: DBClientConfigAsync): Provider[] {
    return [
      DbService,
      {
        provide: PG_CLIENT,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }
}
