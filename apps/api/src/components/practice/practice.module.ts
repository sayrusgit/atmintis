import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import {DataModule} from "@components/data/data.module";
import {PracticeSession, PracticeSessionSchema} from "@entities/practice-session.schema";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{name: PracticeSession.name, schema: PracticeSessionSchema}]),
    DataModule
  ],
  controllers: [PracticeController],
  providers: [PracticeService]
})
export class PracticeModule {}
