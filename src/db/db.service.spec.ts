import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';
import { PG_CLIENT } from './db.constants';

describe('DbService', () => {
  let service: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PG_CLIENT, useFactory: () => ({}) }, DbService],
    }).compile();

    service = module.get<DbService>(DbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
