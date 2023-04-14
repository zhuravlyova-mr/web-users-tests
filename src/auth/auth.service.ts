import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";
import { ModifyUserDto } from 'src/users/dto/modify-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: AuthUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        let user = await this.userService.createUser({...userDto, password: hashPassword})
        const userToken = await this.generateToken(user);
        return {token: userToken, Id: user.id};
    }
    
    async modifying(userDto: ModifyUserDto) {
        
        let user: any;
        if (userDto.userId) {  //если задан id - модифицируем email и password (ищем по id)
            user = await this.userService.getUserById(userDto.userId);
            if (!user) {
                throw new HttpException('Пользователь с таким id не существует', HttpStatus.NOT_FOUND);
            }                     
        }
        else {               //если не задан id - модифицируем только password (ищем по email)
            user = await this.userService.getUserByEmail(userDto.email);
            if (!user) {
                throw new HttpException('Пользователь с таким email не существует', HttpStatus.NOT_FOUND);
            }
        }

        const hashPassword = await bcrypt.hash(userDto.password, 5); //снова хешируем пароль (вдруг изменился)
        await this.userService.modifyUser({...userDto, password: hashPassword});
        const userToken = await this.generateToken(user);
        return {token: userToken, Id: user.id};
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: AuthUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) {
            throw new UnauthorizedException({message: 'Нет пользователя с указанным email'})
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}
