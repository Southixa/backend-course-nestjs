import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HelpersService {
    private jwtSecretKey: string;
    private jwtRefreshTokenSecretKey: string;

    constructor(ConfigService: ConfigService) {
        this.jwtSecretKey = ConfigService.get<string>('JWT_SECRET_KEY');
        this.jwtRefreshTokenSecretKey = ConfigService.get<string>('REFRESH_JWT_SECRET_KEY');
    }

    
    async hashPasswordFunction(password: string): Promise<string> {
        const saltRounds = 10;
    
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
    
        return hash;
      }

    comparePassword(password: string, hashPassword: string): Boolean{
        return bcrypt.compareSync(password, hashPassword);
    }

    genToken(data: User): string {
        return jwt.sign({ data }, this.jwtSecretKey, { expiresIn: '1h' });
    }

    genRefreshToken(data: User): string {
        return jwt.sign({ data }, this.jwtRefreshTokenSecretKey, { expiresIn: '30d' });
    }

    verifyAccessToken(token: string): User {
        try {
            const decoded = jwt.verify(token, this.jwtSecretKey);
            return decoded;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }

    verifyRefreshToken(token: string): User {
        try {
            const decoded = jwt.verify(token, this.jwtRefreshTokenSecretKey);
            return decoded;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }


}
