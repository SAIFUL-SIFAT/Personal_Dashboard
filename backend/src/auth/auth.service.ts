import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} from '@simplewebauthn/server';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private rpID: string;
    private rpName: string;
    private origin: string;

    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
        this.rpID = this.configService.get<string>('RP_ID', 'localhost');
        this.rpName = this.configService.get<string>('RP_NAME', 'PersonalDashboard');
        this.origin = this.configService.get<string>('ORIGIN', 'http://localhost:5173');
    }

    async signup(body: any) {
        const { email, password, name } = body;
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.createWithPassword(email, hashedPassword, name);
    }

    async login(body: any) {
        const { email, password } = body;
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    async generateRegistration(email: string) {
        let user = await this.usersService.findOneByEmail(email);
        if (!user) {
            user = await this.usersService.create(email);
        }

        const options = await generateRegistrationOptions({
            rpName: this.rpName, rpID: this.rpID, userID: Buffer.from(user.id), userName: user.email, attestationType: 'none',
        });
        await this.usersService.update(user.id, { currentChallenge: options.challenge });
        return options;
    }

    async verifyRegistration(email: string, body: any) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !user.currentChallenge) throw new Error('User or challenge not found');
        const verification = await verifyRegistrationResponse({
            response: body, expectedChallenge: user.currentChallenge, expectedOrigin: this.origin, expectedRPID: this.rpID,
        });
        if (verification.verified && verification.registrationInfo) {
            const { credential } = verification.registrationInfo;
            const newCredential = {
                credentialID: Buffer.from(credential.id).toString('base64'),
                credentialPublicKey: Buffer.from(credential.publicKey).toString('base64'),
                counter: credential.counter,
                credentialDeviceType: verification.registrationInfo.credentialDeviceType,
                credentialBackedUp: verification.registrationInfo.credentialBackedUp,
            };
            await this.usersService.update(user.id, {
                credentials: [...(user.credentials || []), newCredential],
                currentChallenge: undefined,
            });
        }
        return verification;
    }
}
