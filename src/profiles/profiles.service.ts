import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {CreateProfileDto} from "./dto/create-profile.dto";
import { Profile } from './profiles.model';
import { DeleteProfileDto } from './dto/delete-profile.dto';
import { ModifyUserDto } from '../users/dto/modify-user.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';

@Injectable()
export class ProfilesService {
    
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                                      private authService: AuthService,
                                      private userService: UsersService) {}

    async createProfile(dto: CreateProfileDto) {
        const userDto: CreateUserDto = new CreateUserDto(); //создаем userDto из profileDto
        [userDto.email, userDto.password, userDto.role] = [dto.email, dto.password, dto.role];
        
        const user = await this.authService.registration(userDto); //обращение к коду аутентификации
        dto.userId = user.Id;
        
        const profile = await this.profileRepository.create(dto);
        if (!profile) {
            throw new HttpException('Профиль не создан', HttpStatus.BAD_REQUEST);
        }
        return user.token; //вернем токен
    }

    async getAllProfiles() {
        const profiles = await this.profileRepository.findAll({include: {all: true}});
        return profiles;
    }

    async getProfileByPhone(phone: string) {
        const profile = await this.profileRepository.findOne({where: {phone}, include: {all: true}});
        return profile;
    }
    
    //для модификации профиля идет обращение из профиля в модуль auth, оттуда - в user
    async modifyProfile(dto: ModifyProfileDto) {
        const userDto: ModifyUserDto = new ModifyUserDto(); //создаем userDto из profileDto
        [userDto.email, userDto.password, userDto.userId] = [dto.email, dto.password, dto.userId];
        
        const user = await this.authService.modifying(userDto); //поменяем данные в таблице users
        const profile = await this.profileRepository.findOne(user.Id);
        if (!profile) {
            throw new HttpException('Профиль не существует', HttpStatus.BAD_REQUEST);
        }

        dto.userId = user.Id;
        for (let key in dto) {       //если не все данные изменяются, нужно в запрос поместить старые данные
            dto[key] = dto[key] || profile[key];   //если есть - берем из dto, иначе из profile
        }
            
        const count = await this.profileRepository.update(
            { birthday: dto.birthday, name: dto.name, gender: dto.gender, phone: dto.phone },
            { where: { userId: dto.userId } }
        );

        if (!count) {
            throw new HttpException('Что-то пошло не так c апдейтом профиля...', HttpStatus.BAD_REQUEST);
        }
        return user.token; //вернем токен
    } 

    //возвращает информацию об удаленном пользователе
    async deleteProfileByEmail(dto: DeleteProfileDto) {
        
        const user = await this.userService.getUserByEmail(dto.email);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        await this.profileRepository.destroy({   //вначале удаляется профиль
            where: {
              userId: user.id,
            },
         })
        .then( () => { this.userService.deleteUser(user.id)});  //затем user  со связями
        return user;
    }
}
