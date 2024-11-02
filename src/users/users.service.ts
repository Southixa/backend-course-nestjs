import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from 'src/helpers/helpers.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private helpersService: HelpersService
    ) {}
    

    getExample(): boolean {
        return false;
    }

    async create(user: User): Promise<User> {

        const hashPassword = await this.helpersService.hashPasswordFunction(user.password);

        console.log("hashPassword in create", hashPassword);

        if(!user.firstname || !user.email || !user.password) throw new BadRequestException('Parameter is empty!.')
        
        const emailExist = await this.userRepository.findOneBy({
            email: user.email,
        });

        console.log({ emailExist });

        if(emailExist) throw new BadRequestException('Email already exist!.')

        const userCreated = await this.userRepository.save({
            ...user,
            password: hashPassword
        });

        return userCreated;
    }


    async login({ email, password}: {email: string, password: string}): Promise<{token: string, refreshToken: string}> {

        // validate data
        if(!email || !password) throw new BadRequestException("Email or Password must required")

        // check email alreadu in database
        const existEmail: User = await this.userRepository.findOneBy({
            email: email
        })

        if(!existEmail) throw new BadRequestException("Email or Password incorrect")

        // compare password in database and input password
        const pwMatch = this.helpersService.comparePassword(password, existEmail.password)

        if(!pwMatch) throw new BadRequestException("Email or Password incorrect")


        // generate token
        const data = {
            id: existEmail.id,
            firstname: existEmail.firstname,
            lastname: existEmail.lastname,
        } as User;

        const token = this.helpersService.genToken(data);
        const refreshToken = this.helpersService.genRefreshToken(data);

        return { token, refreshToken }

    }

    async updatePassword ({email, oldPassword, newPassword}: {email: string, oldPassword: string, newPassword: string}): Promise<{email: string, password: string}> {

        const existEmail = await this.userRepository.findOneBy({
            email: email
        })


        // check email exist
        if(!existEmail) throw new BadRequestException("Email or Password incorrect")

        // compare password in database and input password
        const pwMatch = this.helpersService.comparePassword(oldPassword, existEmail.password)

        if(!pwMatch) throw new BadRequestException("Email or Password incorrect")


        // hash new password
        const hashPassword = await this.helpersService.hashPasswordFunction(newPassword);


        // update password
        const updatePassword = await this.userRepository.save({
            ...existEmail,
            password: hashPassword
        })

        return {
            email: updatePassword.email,
            password: updatePassword.password
        }

    }

    async updateUserProfile(user: User, request: any): Promise<User> {
        // Validate data input
        if (!user.firstname || !user.lastname)
          throw new BadRequestException('Parameter is empty!.');
    
        // Clear email from user input
        if (user.email) delete user.email;
    
        // Hash password if user input
        if (user.password) {
          const hashPW: string = await this.helpersService.hashPasswordFunction(
            user.password,
          );
          user.password = hashPW;
        }
    
        // Check user already in database
        const userDataFromToken = request.user;
    
        const id: number = userDataFromToken.data.id;
        const existUser: User = await this.userRepository.findOneById(id);
        if (!existUser) throw new BadRequestException('Not found your data!.');
    
        await this.userRepository.update(id, user);
        const userData: User = await this.userRepository.findOneById(id);
        return userData;
      }

      async getOwnerProfile(request): Promise<User> {

        console.log({ user: request.user });

        const userData: User = await this.userRepository.findOneByOrFail({id: request.user.data.id});


        // clear password
        delete userData.password;

        return userData;
      }

      async refreshToken(request: any) : Promise<{token: string, refreshToken: string}>{
        // console.log("request =>", request.headers["refresh-token"]);

        const userDataFromRefreshToken: any = this.helpersService.verifyRefreshToken(request.headers["refresh-token"])

        const data = userDataFromRefreshToken.data;
        const newToken = this.helpersService.genToken(data);
        const newRefreshToken = this.helpersService.genRefreshToken(data);

        // console.log("userDataFromRefreshToken =>", userDataFromRefreshToken);

        //Gen new token and refresh token

        return { token: newToken, refreshToken: newRefreshToken };
      }

}
