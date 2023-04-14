import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

interface BlockCreationAttrs {
    name: string;
    title: string;
    content: string;
    image: string;
    group: string;
}

@Table({tableName: 'blocks', createdAt: false, updatedAt: false})
export class Block extends Model<Block, BlockCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'main-hero-text', description: 'Уникальное имя для поиска'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example: 'Это заголовок', description: 'Заголовок блока'})
    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ApiProperty({example: 'Некоторый текст в блоке...', description: 'Текст в блоке'})
    @Column({type: DataType.TEXT, allowNull: true})
    content: string;

    @ApiProperty({example: '.../static/image.png', description: 'Путь к изображению на сервере'})
    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @ApiProperty({example: 'main-page', description: 'Название группы'})
    @Column({type: DataType.STRING, allowNull: true})
    group: string; 
}