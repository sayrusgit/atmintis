import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose';
import { CreateEntryDto, UpdateEntryDto } from '@components/data/dtos/entries.dto';
import { Entry, EntryDocument } from '@entities/entry.schema';
import { validateId } from '@helpers/ValidateId';
import { ListsService } from '@components/data/services/lists.service';
import { IEntry, IResponse } from '@shared/types';
import { csvToJson, EntryJsonFromCsv } from '@helpers/CsvToJson';
import { DefinitionsService } from '@components/data/services/definitions.service';
import { v4 as uuidv4 } from 'uuid';
import { del, put } from '@vercel/blob';

@Injectable()
export class EntriesService {
  constructor(
    @InjectModel(Entry.name) private entryModel: Model<Entry>,
    private listsService: ListsService,
    private definitionsService: DefinitionsService,
  ) {}

  async getEntries(): Promise<EntryDocument[]> {
    return this.entryModel.find();
  }

  async getEntryById(id: string): Promise<EntryDocument> {
    validateId(id);

    return this.entryModel.findById(id).limit(1);
  }

  async getEntriesByList(id: string): Promise<EntryDocument[]> {
    validateId(id);

    return this.entryModel.find({ list: id }).sort({ orderPosition: 1 });
  }

  async getEntriesByUser(id: string): Promise<EntryDocument[]> {
    validateId(id);

    return this.entryModel.find({ user: id });
  }

  async getEntriesRandomized(userId: string, limit: number) {
    const id = new mongoose.Types.ObjectId(userId);

    const res = await this.entryModel.aggregate([
      { $match: { user: id } },
      { $sample: { size: 100 } },
      { $limit: limit },
      { $project: { _id: 1, user: 1, value: 1, image: 1, definitions: 1 } },
    ]);

    return res;
  }

  async getEntriesByListRandomized(listId: string): Promise<EntryDocument[]> {
    const id = new mongoose.Types.ObjectId(listId);

    const res = await this.entryModel.aggregate<EntryDocument>([
      { $match: { list: id } },
      { $sample: { size: 100 } },
      {
        $project: {
          _id: 1,
          value: 1,
          description: 1,
          image: 1,
          confidenceScore: 1,
          lastExercise: 1,
        },
      },
    ]);

    return res;
  }

  async searchEntries(userId: string, query: string): Promise<EntryDocument[]> {
    return this.entryModel.find({ value: new RegExp(query, 'i'), user: userId }).limit(10);
  }

  async createEntry(data: CreateEntryDto): Promise<IResponse<EntryDocument>> {
    if (data.list === undefined) {
      const defaultList = await this.listsService.getDefaultListByUser(data.userId);

      const res = await this.entryModel.create({
        ...data,
        user: data.userId,
        orderPosition: defaultList.entryNumber,
        list: defaultList._id,
      });

      await this.listsService.updateEntriesNumber(String(defaultList._id), 1);

      return {
        success: true,
        message: `Entry "${data.value}" has been created`,
        response: res,
      };
    }

    const list = await this.listsService._getListById(data.list);

    const res = await this.entryModel.create({
      ...data,
      orderPosition: list.entryNumber,
      user: data.userId,
    });

    await this.listsService.updateEntriesNumber(String(list._id), 1);

    return {
      success: true,
      message: `Entry ${data.value} has been created`,
      response: res,
    };
  }

  async updateEntry(id: string, data: UpdateEntryDto): Promise<IResponse<UpdateWriteOpResult>> {
    validateId(id);

    const res = await this.entryModel.updateOne({ _id: id }, data);

    return {
      success: true,
      message: 'Entry has been successfully updated',
      response: res,
    };
  }

  async reassignEntry(id: string, newListId: string): Promise<IResponse<EntryDocument>> {
    validateId(id);

    const res: EntryDocument = await this.entryModel.findOneAndUpdate(
      { _id: id },
      { list: newListId },
    );

    await this.listsService.updateEntriesNumber(String(res.list), -1);
    await this.listsService.updateEntriesNumber(newListId, +1);

    return {
      success: true,
      message: 'Entry has been successfully updated',
      response: res,
    };
  }

  async updateEntryImage(
    id: string,
    file: Buffer,
    rm: string | undefined,
  ): Promise<IResponse<UpdateWriteOpResult>> {
    const entry = await this.entryModel.findOne({ _id: id }, { image: 1 });

    if (rm === 'true') {
      if (entry.image) await del(entry.image);

      await this.entryModel.updateOne({ _id: id }, { image: '' });

      return {
        success: true,
        message: 'Entry image has been removed',
        response: null,
      };
    }

    const filename = 'img-ei-' + uuidv4() + '.webp';

    if (entry.image) await del(entry.image);

    const blob = await put('images/' + filename, file, { access: 'public' });

    const res = await this.entryModel.updateOne({ _id: id }, { image: blob.url });

    return {
      success: true,
      message: 'Entry has been successfully updated',
      response: res,
    };
  }

  async deleteEntry(id: string): Promise<IResponse<EntryDocument>> {
    validateId(id);

    const deletedEntry: EntryDocument = await this.entryModel.findOneAndDelete<EntryDocument>({
      _id: id,
    });

    await this.listsService.updateEntriesNumber(String(deletedEntry.list), -1);
    await this.definitionsService.deleteDefinitionsByEntry(id);
    if (deletedEntry.image) await del(deletedEntry.image);

    return {
      success: true,
      message: 'Entry has been successfully deleted',
      response: deletedEntry,
    };
  }

  async deleteEntriesByList(id: string): Promise<boolean> {
    const entries: IEntry[] = await this.entryModel.find({ list: id });

    for (const entry of entries) {
      if (entry.image) await del(entry.image);
    }

    await this.entryModel.deleteMany({ list: id });
    await this.listsService.updateList(id, { entryNumber: 0 });

    return true;
  }

  async deleteAllEntriesByUserId(id: string): Promise<boolean> {
    const entries: IEntry[] = await this.entryModel.find({ user: id });

    for (const entry of entries) {
      if (entry.image) await del(entry.image);
    }

    await this.entryModel.deleteMany({ user: id });
    await this.definitionsService.deleteAllDefinitionsByUserId(id);

    return true;
  }

  async importEntriesToList(listId: string, csvString: string) {
    const list = await this.listsService._getListById(listId);
    if (!list) throw new NotFoundException('There is no such list');

    const json = csvToJson<EntryJsonFromCsv>(csvString);

    let orderPosition = list.entryNumber;

    const jsonResult = json.map((row) => ({
      orderPosition: orderPosition++,
      value: row.Entry,
      description: row.Description,
      type: row.Type,
      list: listId,
      user: list.user,
    }));

    const res = await this.entryModel.insertMany(jsonResult);

    await this.listsService.updateEntriesNumber(listId, jsonResult.length);

    return {
      success: true,
      message: 'Entry has been successfully deleted',
      response: res,
    };
  }

  async exportEntriesByList(listId: string): Promise<IResponse<string>> {
    const res = await this.getEntriesByList(listId);

    let csv = 'Entry,Description,Type\n';

    res.forEach((entry) => {
      const value = entry.value.includes(',') ? `"${entry.value.trim()}"` : entry.value.trim();
      const description = entry.description.includes(',')
        ? `"${entry.description.trim()}"`
        : entry.description.trim();
      const type = entry.type.includes(',') ? `"${entry.type.trim()}"` : entry.type.trim();

      csv += `${value},${description},${type}\n`;
    });

    return {
      success: true,
      message: 'Entry has been successfully deleted',
      response: csv,
    };
  }
}
