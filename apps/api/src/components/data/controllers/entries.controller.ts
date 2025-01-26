import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateEntryDto, UpdateEntryDto } from '@components/data/dtos/entries.dto';
import { EntriesService } from '@components/data/services/entries.service';
import { ROUTES } from '@constants/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from '../../../common/pipes/sharp.pipe';
import { IMAGE_INTERCEPTOR_OPTIONS } from '@constants/multer-config';

@Controller(ROUTES.ENTRIES)
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Get()
  getEntries() {
    return this.entriesService.getEntries();
  }

  @Get(':id')
  getEntryById(@Param('id') id: string) {
    return this.entriesService.getEntryById(id);
  }

  @Get('get-by-list/:id')
  getEntriesByList(@Param('id') id: string) {
    return this.entriesService.getEntriesByList(id);
  }

  @Get('get-by-list-randomized/:id')
  getEntriesByListRandomized(@Param('id') id: string) {
    return this.entriesService.getEntriesByListRandomized(id);
  }

  @Get('get-by-user/:id')
  getEntriesByUser(@Param('id') id: string) {
    return this.entriesService.getEntriesByUser(id);
  }

  @Get('search-query/:query')
  searchEntries(@Param('query') query: string, @Query('userId') userId: string) {
    return this.entriesService.searchEntries(userId, query);
  }

  @Post('create')
  createEntry(@Body() data: CreateEntryDto) {
    return this.entriesService.createEntry(data);
  }

  @Put(':id')
  updateEntry(@Param('id') id: string, @Body() data: UpdateEntryDto) {
    return this.entriesService.updateEntry(id, data);
  }

  @Put('image/:id')
  @UseInterceptors(FileInterceptor('file', IMAGE_INTERCEPTOR_OPTIONS))
  updateEntryImage(@Param('id') id: string, @UploadedFile(new SharpPipe()) filename: string) {
    return this.entriesService.updateEntryImage(id, filename);
  }

  @Delete(':id')
  deleteEntry(@Param('id') id: string) {
    return this.entriesService.deleteEntry(id);
  }

  @Get('export/:userId')
  exportEntries(@Param('userId') listId: string) {
    //return this.entriesService.exportEntriesByList(listId);
  }

  @Put('import/:listId')
  @UseInterceptors(FileInterceptor('file'))
  importEntriesToList(@Param('listId') listId: string, @UploadedFile() file: Express.Multer.File) {
    return this.entriesService.importEntriesToList(listId, String(file.buffer));
  }

  @Get('export-list/:listId')
  exportEntriesByList(@Param('listId') listId: string) {
    return this.entriesService.exportEntriesByList(listId);
  }
}
