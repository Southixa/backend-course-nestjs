import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('hello')
    hello(): any{
        return {
            name: "pele",
            age: 12
        }
    }
    
    @Post("create")
    create(@Body() {name, lastname}: { name: string; lastname: string }): string {
        return `User created: ${name} ${lastname}`;
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
