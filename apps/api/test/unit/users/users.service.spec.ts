import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../src/entities/user.schema';
import { UsersService } from '../../../src/components/users/users.service';
import { ListsService } from '../../../src/components/data/services/lists.service';
import { DefinitionsService } from '../../../src/components/data/services/definitions.service';
import { EntriesService } from '../../../src/components/data/services/entries.service';

const GET_MODEL_TOKEN = getModelToken('User');

const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const mockListsService = { createList: jest.fn(), deleteAllListsByUserId: jest.fn() };
const mockDefinitionsService = { deleteAllDefinitionsByUserId: jest.fn() };
const mockEntriesService = { deleteAllEntriesByUserId: jest.fn() };

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ListsService,
        DefinitionsService,
        EntriesService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: ListsService, useValue: mockListsService },
        { provide: DefinitionsService, useValue: mockDefinitionsService },
        { provide: EntriesService, useValue: mockEntriesService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(GET_MODEL_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userModel should be defined', () => {
    expect(userModel).toBeDefined();
  });
});
