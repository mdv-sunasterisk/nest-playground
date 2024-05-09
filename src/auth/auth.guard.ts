import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    } else {
      try {
        const token = request.headers.authorization.split(' ')[1];

        
        if(token) {
          this.jwt.verify(token);
        }
      } catch (error) {
        throw new UnauthorizedException('Unauthozed access.');
      }
    }

    return true;
  }
}
