import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { RolesGuard } from 'src/guard/role.guard';
import { EditGuard } from 'src/guard/edit.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Tạo người dùng mới
  @Post()
  @UseGuards(RolesGuard)
  async create(@Body() createUserDto: any): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Lấy tất cả người dùng
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Lấy người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  // Cập nhật người dùng
  @Put(':id')
  @UseGuards(EditGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // Xóa người dùng
  @Delete(':id')
  @UseGuards(EditGuard)
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}