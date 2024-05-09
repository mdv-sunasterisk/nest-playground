import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {

    async generateSalt() {
        const saltRounds = 10;
        
        return bcrypt.genSalt(saltRounds);
    }
    async hashPassword(password: string) {
        const salt = await this.generateSalt();
    
        return bcrypt.hash(password, salt);
    }

    async validatePassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword)
    }
}
