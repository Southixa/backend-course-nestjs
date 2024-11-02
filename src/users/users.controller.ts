import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { promises } from 'dns';
import { User } from './users.entity';
import { AuthGuard } from 'src/helpers/auth.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()

    example(): boolean{
        return this.userService.getExample();
    }
    
    // @Post("create")
    // create(@Body() {name, lastname}: { name: string; lastname: string }): string {
    //     return `User created: ${name} ${lastname}`;
    // }

    @Post("create")
    create(@Body() user:User ): Promise<User> {
        return this.userService.create(user);
    }

    @Put('update/:id')
    update(@Param() { id }: { id: string }): string {
        return `User ${id} updated`;
    }

    @Get('user')
    findOne(@Query() { id }: { id: string }): string {
        return id;
    }

    @Post("login")
    login(@Body() {email, password}: {email: string, password: string}): Promise<{token: string, refreshToken: string}> {
        return this.userService.login({email, password});
    }

    @Put("updatePassword")
    updatePassword(@Body() {email, oldPassword, newPassword}: {email: string, oldPassword: string, newPassword: string}): Promise<{email: string, password: string}> {
        return this.userService.updatePassword({email, oldPassword, newPassword})
    }

    @Put('updateProfile')
    @UseGuards(AuthGuard)
    updateProfile(@Req() request, @Body() user: User): Promise<User>{
        return this.userService.updateUserProfile(user, request);
    }


    @Get('profile')
    @UseGuards(AuthGuard)
    ownerProfile(@Req() request): Promise<User> {
        return this.userService.getOwnerProfile(request);
    }


    @Put('refresh/token')
    refreshToken(@Req() request): Promise<{token: string, refreshToken: string}> {
        return this.userService.refreshToken(request);
    }

}
