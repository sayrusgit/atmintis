import {Module} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@components/auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import * as process from "process";
import {DataModule} from "@components/data/data.module";
import {UsersModule} from "@components/users/users.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import { PracticeModule } from '@components/practice/practice.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    MongooseModule.forRoot(process.env.DB_URL),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
      serveRoot: '/static'
    }),

    // modules
    AuthModule,
    DataModule,
    UsersModule,
    PracticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
