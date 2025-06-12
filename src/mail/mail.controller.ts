import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-verification-code')
  async sendVerificationCode(
    @Body('to') to: string,
    @Body('code') code: string,
  ) {
    await this.mailService.sendVerificationCode(to, code);
    return { message: 'Verification code sent successfully' };
  }

  @Post('send-notification-with-pdf')
  @UseInterceptors(FileInterceptor('file')) 
  async sendNotificationWithAttachment(
    @Body('to') to: string,
    @Body('note') note: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.mailService.sendNotificationWithAttachment(to, note, file);
    return { message: 'Notification with attachment sent successfully' };
  }

  @Post('notify-project-updated')
  async notifyProjectUpdated(
    @Body('to') to: string,
    @Body('projectName') projectName: string,
    @Body('updatedFields') updatedFields: string[],
  ) {
    await this.mailService.notifyProjectUpdated(to, projectName, updatedFields);
    return { message: 'Project update notification sent successfully' };
  }

  @Post('notify-new-project-following')
  async notifyNewProjectByFollowing(
    @Body('userEmail') userEmail: string,
    @Body('authorName') authorName: string,
    @Body('projectName') projectName: string,
  ) {
    await this.mailService.notifyNewProjectByFollowing(
      userEmail,
      authorName,
      projectName,
    );
    return { message: 'New project following notification sent successfully' };
  }
}
