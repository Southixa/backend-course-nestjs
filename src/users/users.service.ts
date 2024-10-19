import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    getExample(): boolean {
        return false;
    }

    create(name: string, lastname: string): string {
        return `User created: ${name} ${lastname}`;
    }
}
