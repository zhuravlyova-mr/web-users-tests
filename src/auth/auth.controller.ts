import { Controller, Post, Body } from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('Авторизация') 
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: AuthUserDto) {
        return this.authService.login(userDto);
    }

}
