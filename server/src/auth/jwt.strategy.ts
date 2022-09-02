import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from "src/user/user.service"
import { jwtConstants } from "src/common/helper/jwtConstants"

Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: jwtConstants.at_secret
        })
    }
    public async validate(payload: any, req: any): Promise<any> {
        return { userId: req.userId, email: req.email, roles: req.roles }
    }

}

        // public async validate(payload: any, req: any, done: Function) {
        // console.log(req.email)
        // return req

        // const user = null

        // const user = await this.userService.getUserByEmail(req.email)
        // if (!user) return null
        // return user

        // return this.userService.getUserByEmail(req.email)
        // const user = 'hi'
        // console.log(user)
        // if (!user) return done(new UnauthorizedException(), false)
        // done(null, user)
    // }

    // public async validate(payload: any, req: any, done: Function) {
    //     const user = await this.authService.validateUser(req)
    //     console.log(user)
    //     console.log(payload)
    //     console.log(req)
    //     if (!user) {
    //         return done(new UnauthorizedException(), false)
    //     }
    //     done(null, user)
    // }
// }