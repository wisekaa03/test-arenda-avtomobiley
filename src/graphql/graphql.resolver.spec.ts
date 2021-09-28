import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlResolver } from './graphql.resolver';
import { GraphqlService } from './graphql.service';

const mockGraphqlService = () => ({
  listCars: jest.fn(),
  calculateLease: jest.fn(),
  bookCarRental: jest.fn(),
  deleteCarRental: jest.fn(),
  statistics: jest.fn(),
});

describe('GraphqlResolver', () => {
  let resolver: GraphqlResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphqlResolver,
        { provide: GraphqlService, useFactory: mockGraphqlService },
      ],
    }).compile();

    resolver = module.get<GraphqlResolver>(GraphqlResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
