import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Block } from './textblocks.model';
import { TextBlockService } from './textblock.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { ModifyBlockDto } from './dto/modify-block.dto';
import { JwtIfAdmin } from '../auth/jwt-if-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Текстовые блоки')
@Controller('textblocks')
export class TextblockController {
    
    constructor(private textBlockService: TextBlockService) {}

    @ApiOperation({summary: 'Создать текстовый блок'})
    @ApiResponse({status: 201, type: Block})
    @UsePipes(ValidationPipe)
    @UseGuards(JwtIfAdmin)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() blockDto: CreateBlockDto,
           @UploadedFile() image) {
        return this.textBlockService.createTextBlock(blockDto, image);
    }

    @ApiOperation({summary: 'Получение всех текстовых блоков'})
    @ApiResponse({status: 200, type: [Block]})
    @Get()
    getAll() {
        return this.textBlockService.getAllTextBlocks();
    }

    @ApiOperation({summary: 'Получение блока по Id'})
    @ApiResponse({status: 200, type: Block})
    @Get('/:id')
    getTextBlockById(@Param('id') id: number) {
        return this.textBlockService.getTextBlockById(id);
    } 
    
    @ApiOperation({summary: 'Получение блока по уникальному названию'})
    @ApiResponse({status: 200, type: Block})
    @Get('/name/:name')
    getTextBlockByName(@Param('name') name: string) {
        return this.textBlockService.getTextBlockByName(name);
    }

    @ApiOperation({summary: 'Получение всех блоков из заданной группы'})
    @ApiResponse({status: 200, type: [Block]})
    @Get('/groups/:group')
    getByGroup(@Param('group') group: string) {
        return this.textBlockService.getTextBlockByGroup(group);
    }

    @ApiOperation({summary: 'Удаление блока по Id'})
    @ApiResponse({status: 200, type: Number})
    @UseGuards(JwtIfAdmin)   
    @Delete('/:id')
    deleteById(@Param('id') id: number) {
        return this.textBlockService.deleteTextBlockById(id);
    }

    @ApiOperation({summary: 'Удаление блока по уникальному названию'})
    @ApiResponse({status: 200, type: String})
    @UseGuards(JwtIfAdmin)   
    @Delete('/name/:name')
    deleteByName(@Param('name') name: string) {
        return this.textBlockService.deleteTextBlockByName(name);
    }

    @ApiOperation({summary: 'Редактирование текстового блока'})
    @ApiResponse({status: 200, type: ModifyBlockDto})
    @UseGuards(JwtIfAdmin)
    @Put()
    @UseInterceptors(FileInterceptor('image'))
    modifyTextBlock(@Body() blockDto: ModifyBlockDto,  
                    @UploadedFile() image) {
        return this.textBlockService.modifyTextBlock(blockDto, image);
    }
}