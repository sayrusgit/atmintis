import { Module } from '@nestjs/common';
import { EntriesController } from './controllers/entries.controller';
import { EntriesService } from './services/entries.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DefinitionsController } from './controllers/definitions.controller';
import { DefinitionsService } from './services/definitions.service';
import { ListsService } from './services/lists.service';
import { ListsController } from './controllers/lists.controller';
import { Entry, EntrySchema } from '@entities/entry.schema';
import { Definition, DefinitionSchema } from '@entities/definition.schema';
import { List, ListSchema } from '@entities/list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entry.name, schema: EntrySchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: List.name, schema: ListSchema },
    ]),
  ],
  controllers: [EntriesController, DefinitionsController, ListsController],
  providers: [EntriesService, DefinitionsService, ListsService],
  exports: [EntriesService, ListsService, DefinitionsService],
})
export class DataModule {}
