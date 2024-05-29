import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

        if(!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        console.log(user);

        return requiredRoles.some((role: string) => user?.role == role);
    }
}