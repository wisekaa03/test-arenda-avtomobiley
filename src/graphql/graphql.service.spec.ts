import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlService } from './graphql.service';
import { DbModule } from '../db/db.module';

describe('GraphqlService', () => {
  let service: GraphqlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule.registerAsync({ useFactory: () => ({}) })],
      providers: [GraphqlService],
    }).compile();

    service = module.get<GraphqlService>(GraphqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
