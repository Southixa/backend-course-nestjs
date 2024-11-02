import { HelpersService } from 'src/helpers/helpers.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (
        private HelpersService: HelpersService
    ) {

    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token: string = request.headers.authorization.split(" ")[1];

        console.log("token =>", token);
        
        if(!token) throw new BadRequestException("Token must required!");

        const userData = this.HelpersService.verifyAccessToken(token);
        console.log("userData =>", userData);

        request.user = userData;

        return true;
    }
}