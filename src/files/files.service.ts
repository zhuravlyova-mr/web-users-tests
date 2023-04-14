import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';
import * as uuid from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FileTable } from './files.model';

@Injectable()
export class FilesService {
    
    constructor(@InjectModel(FileTable) private fileRepository: typeof FileTable) {}

    async createFile(file: any): Promise<string> { 
        if (!file) {
            return;
        }
        try {
             
            let extension = '.' + file.originalname.split('.').pop(); //возьмем настоящее расширение файла
            const fileName = uuid.v4() +  extension;
            const filePath = path.resolve(__dirname, '..', 'static')

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return path.join(filePath, fileName);
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    //создает запись о файле в таблице, которая хранит файлы
    //и ссылки на те таблицы, которые используют эти файлы
    async createInTable(table: string, id: number, fileName: string, file: any) {
        const fileDescriptor = await this.fileRepository.create({
            name: fileName,
            content: file.buffer,
            essenceTable: table,
            essenceId: id,
        });
        if (!fileDescriptor) {
            throw new HttpException('Файл не был записан в БД', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
     
    //update файла в БД
    async updateInTable(table: string, id: number, fileName: string, file: any) {
        const count = await this.fileRepository.update(
            { name: fileName, content: file.buffer },
            { where: { essenceTable: table, essenceId: id } }
        );

        if (!count) {
            throw new HttpException('Файл не был обновлен в БД', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    async deleteFiles() {
        const files = this.fileRepository.destroy({where: {
            [Op.or]: [{ createdAt: { [Op.lte]: Date.now() - 3600000} },
                      { [Op.and]: [{ essenceTable: null }, { essenceId: null }] }]                    
            },
          });

        if (!files) {
            throw new HttpException('Нет подходящих для удаления файлов', HttpStatus.BAD_REQUEST);
        }
        return files;
    }

    async getAllFiles() {
        const files = await this.fileRepository.findAll();
        return files;
        //Buffer.from(files[0].content).toString('base64');/... - в дальнейшем нужно преобразовать файлы в картинки/фильмы
    }
    
    //если essenceTable перестала использовать файл,
    //соответствующие поля обнуляются
    async updateFields(table: string, id: number) {
        await this.fileRepository.update(
            { essenceTable: null, essenceId: null },
            { where: { essenceTable: table, essenceId: id } }
        )
    }


}
