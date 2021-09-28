import { ModuleMetadata } from '@nestjs/common';
import { ClientConfig } from 'pg';

export interface DBClientConfigAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<ClientConfig> | ClientConfig;
  inject?: any[];
}
