import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EditGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    const { id } = request.params; 

    // Kiểm tra xem người dùng có phải là Admin, Lead hoặc chính chủ bài viết
    if (user.role.includes('admin') || user.role.includes('lead')) {
      return true; 
    }

    // Kiểm tra xem người dùng có phải là chính chủ bài viết không
    if (user._id.toString() === id) {
      return true; 
    }

    throw new ForbiddenException('You are not allowed to delete this post'); 
  }
}
