import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Xác nhận đăng nhập',
      template: './verification',
      context: { code },
    });
  }

  async sendNotificationWithAttachment(
    to: string,
    note: string,
    file: Express.Multer.File,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Thông báo mới từ hệ thống',
      template: './notification',
      context: { note },
      attachments: [
        {
          filename: file.originalname || 'attachment.pdf',
          content: file.buffer,
          contentType: file.mimetype || 'application/pdf',
        },
      ],
    });
  }

  async notifyProjectUpdated(
    to: string,
    projectName: string,
    updatedFields: string[],
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: `Dự án "${projectName}" vừa được cập nhật`,
      template: './project-update',
      context: {
        projectName,
        updatedFields,
      },
    });
  }

  async notifyNewProjectByFollowing(
    userEmail: string,
    authorName: string,
    projectName: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: `${authorName} vừa tạo dự án mới`,
      template: './new-project-following',
      context: {
        authorName,
        projectName,
      },
    });
  }
}
