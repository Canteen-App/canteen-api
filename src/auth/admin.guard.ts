import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { admin } from './firebase.module';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers['authorization'];
    if (
      authorizationHeader ||
      typeof authorizationHeader == 'string' ||
      authorizationHeader?.startsWith('Bearer ')
    ) {
      const accessToken = authorizationHeader.split(' ')[1];

      try {
        const decodedToken = await admin.auth().verifyIdToken(accessToken);
        request.user = decodedToken;
        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }
}
