import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import { Op } from 'sequelize';
import { TestRoleDto } from './dto/test-role.dto';

@Injectable()
export class RolesService {
    
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        if (!role) {
            throw new HttpException('Роль не создана', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return role;
    }

    //получить все роли
    async getAllRoles() {
        const roles = await this.roleRepository.findAll({include: {all: true}});
        return roles;
    } 

    //получить роль по значению
    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }

    //для тестирования c заглушкой для БД
    async getRoleByValueTest(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        let res: TestRoleDto; //for unit testing
        [res.id, res.value, res.description] = [role.id, role.value, role.description];
        return res;
    }

    //получить роли по описанию
    async getRolesByDescription(description: string) {
        const roles = await this.roleRepository.findAll({where: {
            description: {
              [Op.substring]: description,               //используется поиск по подстроке - like
            },
          },
        });
        return roles;
    }

    //удалить роль по значению
    async deleteRoleByValue(value: string) {
        try {
            await this.roleRepository.destroy({where: {value}});
        }
        catch (err) {
            throw new HttpException('Роль используется, ее нельзя удалить', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
