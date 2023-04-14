//п.4 - Модуль для работы с профилем
import { forwardRef, Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profiles.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import { User } from '../users/users.model';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    SequelizeModule.forFeature([User, Profile]),
    RolesModule,
    UsersModule,
    AuthModule,
  ],
  exports: [
    ProfilesService,
  ]
})

export class ProfilesModule {}
