import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileTable } from './files.model';
import { JwtIfAdmin } from '../auth/jwt-if-admin.guard';

@ApiTags('Обработка файлов')
@Controller('files')
export class FilesController {

    constructor(private filesService: FilesService) {}
     
    @ApiOperation({summary: 'Удаление лишних файлов'})
    @ApiResponse({status: 200})
    @UseGuards(JwtIfAdmin)
    @Delete()
    deleteFiles() {
        return this.filesService.deleteFiles();
    }
    
    @ApiOperation({summary: 'Получение всех файлов'}) //данные файлов приходят как buffer
    @ApiResponse({status: 200, type: FileTable})
    @UseGuards(JwtIfAdmin)
    @Get()
    getAllFiles() {
        return this.filesService.getAllFiles();
    }
}
