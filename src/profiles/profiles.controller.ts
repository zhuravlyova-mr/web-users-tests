import {Body, Controller, Get, Post, Put, Delete, UseGuards, UsePipes, Param} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfilesService} from "./profiles.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Profile} from "./profiles.model";
import {ValidationPipe} from "../pipes/validation.pipe";
import { JwtCheckUserGuard } from '../auth/jwt-check-user.guard';
import { DeleteProfileDto } from './dto/delete-profile.dto';
import { ModifyProfileDto } from './dto/modify-profile.dto';
import { User } from '../users/users.model';

@ApiTags('Профили пользователей')
@Controller('profiles')
export class ProfilesController {
    
    constructor(private profilesService: ProfilesService) {}

    @ApiOperation({summary: 'Создать профиль пользователя'})
    @ApiResponse({status: 201, type: Profile})
    @UsePipes(ValidationPipe)
    @Post('/registration')
    create(@Body() profileDto: CreateProfileDto) {
        return this.profilesService.createProfile(profileDto);
    }

    @ApiOperation({summary: 'Получение всех профилей пользователей'})
    @ApiResponse({status: 200, type: [Profile]})
    @UseGuards(JwtCheckUserGuard)
    @Get()
    getAll() {
        return this.profilesService.getAllProfiles();
    }

    @ApiOperation({summary: 'Получение профиля по номеру телефона'})
    @ApiResponse({status: 200, type: Profile})
    @Get('/:phone')
    getByPhone(@Param('phone') phone: string) {
        return this.profilesService.getProfileByPhone(phone);
    }

    @ApiOperation({summary: 'Удаление профиля по email'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(JwtCheckUserGuard)
    @Delete()
    deleteByEmail(@Body() profileDto: DeleteProfileDto) {
        return this.profilesService.deleteProfileByEmail(profileDto);
    }

    @ApiOperation({summary: 'Редактирование профиля'})
    @ApiResponse({status: 200, type: Profile})
    @UseGuards(JwtCheckUserGuard)
    @Put()
    modifyUserProfile(@Body() profileDto: ModifyProfileDto) {
        return this.profilesService.modifyProfile(profileDto);
    }
}
