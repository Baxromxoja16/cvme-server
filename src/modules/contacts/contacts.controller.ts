import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContactsService } from './contacts.service';

@Controller('contacts')
@UseGuards(AuthGuard('jwt'))
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll(@Req() req) {
    return this.contactsService.findAll(req.user._id);
  }

  @Post()
  async add(
    @Req() req,
    @Body() contact: { type: string; value: string; icon: string },
  ) {
    return this.contactsService.add(req.user._id, contact);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') contactId: string,
    @Body() updateData: Partial<{ type: string; value: string; icon: string }>,
  ) {
    return this.contactsService.update(req.user._id, contactId, updateData);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') contactId: string) {
    return this.contactsService.remove(req.user._id, contactId);
  }
}
