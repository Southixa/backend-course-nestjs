import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';

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
    create(@Body() {name, lastname}: { name: string; lastname: string }): string {
        return this.userService.create(name, lastname);
    }

    @Put('update/:id')
    update(@Param() { id }: { id: string }): string {
        return `User ${id} updated`;
    }

    @Get('user')
    findOne(@Query() { id }: { id: string }): string {
        return id;
    }
}
