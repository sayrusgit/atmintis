import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { Definition, DefinitionDocument } from '@entities/definition.schema';
import { CreateDefinitionDto } from '@components/data/dtos/definitions';
import { IResponse } from '@shared/types';

@Injectable()
export class DefinitionsService {
  constructor(@InjectModel(Definition.name) private definitionModel: Model<Definition>) {}

  async getDefinitions(): Promise<DefinitionDocument[]> {
    const res = await this.definitionModel.find();

    return res;
  }

  async getDefinitionById(id: string): Promise<DefinitionDocument> {
    const res = await this.definitionModel.findOne({ _id: id });

    return res;
  }

  async getDefinitionsByEntry(entryId: string): Promise<DefinitionDocument[]> {
    const res = await this.definitionModel.find({ parentEntry: entryId });

    return res;
  }

  async createDefinition(data: CreateDefinitionDto): Promise<IResponse<DefinitionDocument>> {
    const res = await this.definitionModel.create(data);

    return {
      success: true,
      message: `Definition has been created`,
      response: res,
    };
  }

  async deleteDefinition(id: string): Promise<IResponse<DeleteResult>> {
    const res = await this.definitionModel.deleteOne({ _id: id });

    return {
      success: true,
      message: `Definition has been removed`,
      response: res,
    };
  }

  async deleteDefinitionsByEntry(id: string): Promise<IResponse<DeleteResult>> {
    const res = await this.definitionModel.deleteMany({ parentEntry: id });

    return {
      success: true,
      message: `Definitions has been removed`,
      response: res,
    };
  }

  async deleteAllDefinitionsByUserId(id: string): Promise<boolean> {
    await this.definitionModel.deleteMany({ user: id });

    return true;
  }
}
