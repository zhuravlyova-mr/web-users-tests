import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileTable } from './files.model';
import { FilesController } from './files.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [FilesService],
  imports: [
    SequelizeModule.forFeature([FileTable]),
    AuthModule,
  ],
  exports: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
