import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenKeyService } from '../tokenKey.service';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenService: TokenKeyService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req?.cookies?.accessToken) {
            return req.cookies.accessToken;
          }
          return null;
        },
      ]),

      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          const decoded: any = jwt.decode(rawJwtToken);
          const userId = decoded?.sub;
          if (!userId) return done(new Error('Missing userId'), null);

          const publicKey = await this.tokenService.getPublicKey(userId);
          done(null, publicKey);
        } catch (err) {
          done(err, null);
        }
      },
    });
  }

  async validate(payload: any) {
    return { _id: payload.sub, username: payload.username };
  }
}
