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
import { ListsService } from '@components/data/services/lists.service';
import { CreateListDto, UpdateListDto } from '@components/data/dtos/lists.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_INTERCEPTOR_OPTIONS } from '@constants/multer-config';
import { SharpPipe } from '../../../common/pipes/sharp.pipe';
import { User } from '@decorators/user.decorator';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  getLists() {
    return this.listsService.getLists();
  }

  @Get(':id')
  getList(@Param('id') id: string, @User() user: any) {
    return this.listsService.getListById(id, user);
  }

  @Get('get-by-user/:id')
  getListsByUser(@Param('id') id: string) {
    return this.listsService.getListsByUser(id);
  }

  @Get('get-default-by-user/:id')
  getDefaultListByUser(@Param('id') id: string) {
    return this.listsService.getDefaultListByUser(id);
  }

  @Post()
  createList(@Body() data: CreateListDto) {
    return this.listsService.createList(data);
  }

  @Put(':id')
  updateList(@Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listsService.updateList(id, data);
  }

  @Put('image/:id')
  @UseInterceptors(FileInterceptor('file', IMAGE_INTERCEPTOR_OPTIONS))
  updateListImage(
    @Param('id') id: string,
    @UploadedFile(new SharpPipe()) file: Buffer,
    @Query('rm') rm: string,
  ) {
    return this.listsService.updateListImage(id, file, rm);
  }

  @Delete(':id')
  deleteList(@Param('id') id: string) {
    return this.listsService.deleteList(id);
  }
}
