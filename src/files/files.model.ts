import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface FileCreationAttrs {
    name: string;
    content: string;
    essenceTable: string;
    essenceId: number;
}

@Table({tableName: 'files'})
export class FileTable extends Model<FileTable, FileCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'filename.jpg', description: 'Уникальное имя файла'})
    @Column({type: DataType.STRING, unique: true})
    name: string;

    @ApiProperty({example: 'e@#D#322254#$$%5egtgtgtr##$56', description: 'Файл в двоичном формате'})
    @Column({type: DataType.BLOB})
    content: string;

    @ApiProperty({example: 'profile', description: 'Название таблицы, к которой относится файл'})
    @Column({type: DataType.STRING})
    essenceTable: string;

    @ApiProperty({example: '17', description: 'Идентификатор записи в таблице, к которой относится файл'})
    @Column({type: DataType.INTEGER})
    essenceId: number;
}