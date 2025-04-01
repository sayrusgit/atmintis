import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@components/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';
import { DataModule } from '@components/data/data.module';
import { UsersModule } from '@components/users/users.module';
import { ExerciseModule } from '@components/exercise/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL),

    // modules
    AuthModule,
    DataModule,
    UsersModule,
    ExerciseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
