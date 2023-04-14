import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { Block } from './textblocks.model';
import { InjectModel } from '@nestjs/sequelize';
import { ModifyBlockDto } from './dto/modify-block.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class TextBlockService {
   
    constructor(@InjectModel(Block) private blockRepository: typeof Block,
                 private fileService: FilesService) {}

    async createTextBlock(dto: CreateBlockDto, image: any) {
        if (!image) { //for testing
            const block = await this.blockRepository.create(dto);
            if (!block) {
                throw new HttpException('Текстовый блок не создан', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return block;
        }
        const fileName = await this.fileService.createFile(image);
        const textBlock = await this.blockRepository.create({...dto, image: fileName});
        
        //записать данные о файле и самом файле
        await this.fileService.createInTable('blocks', textBlock.id, fileName, image);
        return textBlock;
    }

    async modifyTextBlock(dto: ModifyBlockDto, uploadedImage: any) {
        let fileName: string;
        if (uploadedImage) {
            fileName = await this.fileService.createFile(uploadedImage);
        }
        const modifyedId = await this.prepareDto(fileName, dto);
                                                  
        const count = await this.blockRepository.update( 
            { name: dto.name, title: dto.title, 
              content: dto.content, image: dto.image, group: dto.group }, //id может не оказаться в dto
            { where: { id: modifyedId } }                                
        );
        console.log(modifyedId); 
        if (!count) {
            throw new HttpException('Не удалось обновить данные блока', HttpStatus.BAD_REQUEST);
        }

        if (fileName) {   //обновить данные о файле
            await this.fileService.updateInTable('blocks', modifyedId, fileName, uploadedImage);
        }
        return dto;
    } 
    
    async getAllTextBlocks() {
        const textBlocks = await this.blockRepository.findAll({include: {all: true}});
        return textBlocks;
    }

    async getTextBlockByName(name: string) {
        const textBlock = await this.blockRepository.findOne({where: {name}, include: {all: true}});
        return textBlock;
    }
    
    async getTextBlockById(id: number) {
        const textBlock = await this.blockRepository.findOne({where: {id}, include: {all: true}});
        return textBlock;
    }

    async getTextBlockByGroup(group: string) {
        const textBlocks = await this.blockRepository.findAll({where: {group}, include: {all: true}});
        return textBlocks;
    }

    async deleteTextBlockById(id: number) {
        const count = await this.blockRepository.destroy({where: {id}})
        if (!count) {
            throw new HttpException('Текстовый блок не был удален', HttpStatus.NOT_FOUND);
        }
        await this.fileService.updateFields('blocks', id); //у удаленного блока файл 'теряет' таблицу и id
        return id;
    }    

    async deleteTextBlockByName(name: string) {
        const block = await this.getTextBlockByName(name);
        if (!block) {
            throw new HttpException('Блок не найден, операция удаления прервана', HttpStatus.BAD_REQUEST);
        }
        if (!block.image) {  //for testing
            await this.blockRepository.destroy({where: {name}});
        }
        else {
            await this.deleteTextBlockById(block.id);
        }
        return name;
    }

    private async prepareDto(fileName: string, dto: ModifyBlockDto) {
        let textBlock: Block;       
        if (dto.id) {
            textBlock = await this.getTextBlockById(dto.id);
        }
        else {
            textBlock = await this.getTextBlockByName(dto.name);
        }
        if (!textBlock) {
            throw new HttpException('Текстовый блок не найден или не заданы параметры запроса', HttpStatus.BAD_REQUEST);
        }
        for (let key in dto) {                        //как в профиле в аналогичной функции
            dto[key] = dto[key] || textBlock[key];    //если данное не задано, оставляем старое значение
        }
        if (fileName) {                               //если картинка изменяется, ее надо изменить, в т.ч. в таблице файлов
            dto.image = fileName;
        }  
        return textBlock.id;
    } 
}
