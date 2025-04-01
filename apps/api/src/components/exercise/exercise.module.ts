import { Module } from '@nestjs/common';
import { DataModule } from '@components/data/data.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseController } from '@components/exercise/exercise.controller';
import { Exercise, ExerciseSchema } from '@entities/exercise.schema';
import { ExerciseService } from '@components/exercise/exercise.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
    DataModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
