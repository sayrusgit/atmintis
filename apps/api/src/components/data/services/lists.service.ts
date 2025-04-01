import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { CreateListDto, UpdateListDto } from '@components/data/dtos/lists.dto';
import { List, ListDocument } from '@entities/list.schema';
import { validateId } from '@helpers/ValidateId';
import { IEntry, IJwtPayload, IResponse } from '@shared/types';
import { Entry } from '@entities/entry.schema';
import { removeFile } from '@helpers/RemoveFile';
import { del, put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Entry.name) private entryModel: Model<Entry>,
  ) {}

  async getLists(): Promise<ListDocument[]> {
    return this.listModel.find();
  }

  async _getListById(listId: string): Promise<ListDocument> {
    return this.listModel.findById(listId);
  }

  async getListById(listId: string, user: IJwtPayload): Promise<ListDocument> {
    const list: ListDocument = await this.listModel.findById(listId);
    if (!list) throw new BadRequestException('List not found');

    if (!list.isPrivate) return list;

    if (String(list.user) !== user.sub) throw new ForbiddenException('This list is private');

    return list;
  }

  async getListsByUser(id: string): Promise<ListDocument[]> {
    validateId(id);

    const res = await this.listModel.find({ user: id });
    if (!res.length) throw new BadRequestException('Lists not found');

    return res;
  }

  async getDefaultListByUser(id: string): Promise<ListDocument> {
    validateId(id);

    const res = await this.listModel.findOne({ user: id, isDefault: true });
    if (!res) throw new BadRequestException('Lists not found');

    return res;
  }

  async createList(data: CreateListDto): Promise<IResponse<ListDocument>> {
    const res = await this.listModel.create({
      ...data,
      entryNumber: 0,
      user: data.userId,
    });

    if (!res) throw new BadRequestException('Something went wrong, try again');

    return {
      success: true,
      message: 'New list is created',
      response: res,
    };
  }

  async updateList(id: string, data: UpdateListDto): Promise<IResponse<UpdateWriteOpResult>> {
    const res = await this.listModel.updateOne({ _id: id }, data);

    return {
      success: true,
      message: 'List has been successfully updated',
      response: res,
    };
  }

  async updateListImage(
    id: string,
    file: Buffer,
    rm: string | undefined,
  ): Promise<IResponse<UpdateWriteOpResult>> {
    const list = await this.listModel.findOne({ _id: id }, { image: 1 });

    if (rm === 'true') {
      if (list.image) await del(list.image);

      await this.listModel.updateOne({ _id: id }, { image: '' });

      return {
        success: true,
        message: 'Collection cover has been removed',
        response: null,
      };
    }

    const filename = 'img-li-' + uuidv4() + '.webp';

    if (list.image) await del(list.image);

    const blob = await put('images/' + filename, file, { access: 'public' });

    const res = await this.listModel.updateOne({ _id: id }, { image: blob.url });

    return {
      success: true,
      message: 'Collection cover has been updated',
      response: res,
    };
  }

  async updateEntriesNumber(listId: string, newEntries: number): Promise<IResponse<ListDocument>> {
    const res = await this._getListById(listId);

    res.entryNumber = res.entryNumber + newEntries;
    await res.save();

    return {
      success: true,
      message: null,
      response: res,
    };
  }

  async deleteList(id: string): Promise<IResponse<ListDocument>> {
    validateId(id);

    const deletedList: ListDocument = await this.listModel.findOneAndDelete({ _id: id });

    if (deletedList.image) await del(deletedList.image);

    const entries: IEntry[] = await this.entryModel.find({ list: id });

    for (const entry of entries) {
      if (entry.image) await removeFile(entry.image, 'images');
    }

    await this.entryModel.deleteMany({ list: id });

    return {
      success: true,
      message: 'The list has been successfully deleted',
      response: deletedList,
    };
  }

  async deleteAllListsByUserId(id: string): Promise<boolean> {
    const lists: ListDocument[] = await this.getListsByUser(id);

    for (const list of lists) {
      if (list.image) await del(list.image);
    }

    await this.listModel.deleteMany({ user: id });

    return true;
  }
}
