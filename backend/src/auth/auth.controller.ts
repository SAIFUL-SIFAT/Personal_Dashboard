import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signup(@Body() body: any) {
        return this.authService.signup(body);
    }

    @Post('login')
    login(@Body() body: any) {
        return this.authService.login(body);
    }

    @Post('register-options')
    generateRegistration(@Body('email') email: string) {
        return this.authService.generateRegistration(email);
    }

    @Post('register-verify')
    verifyRegistration(@Body('email') email: string, @Body('body') body: any) {
        return this.authService.verifyRegistration(email, body);
    }
}
