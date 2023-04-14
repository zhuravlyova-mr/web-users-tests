import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from "./profiles/profiles.model";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TextblockModule } from './textblock/textblock.module';
import * as path from "path";

@Module({
    controllers: [],
    providers: [],
    imports: [
      ConfigModule.forRoot(
        {envFilePath: `.${process.env.NODE_ENV}.env`,}),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, 'static'),
        }), 
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost', //process.env.POSTGRES_HOST,
          port: 5432, //Number(process.env.POSTGRES_PORT),
          username: 'postgres', // process.env.POSTGRES_USER,
          password: 'root', //process.env.POSTGRES_PASSWORD,
          database: 'web_users_test', //process.env.POSTGRES_DB,
          models: [User, Role, UserRoles, Profile],
          autoLoadModels: true
        }),    
      UsersModule, RolesModule, AuthModule, ProfilesModule, TextblockModule,
    ]
})


export class AppModule {}