import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ROUTES } from '@constants/index';
import { DefinitionsService } from '@components/data/services/definitions.service';
import { CreateDefinitionDto } from '@components/data/dtos/definitions';

@Controller(ROUTES.DEFINITIONS)
export class DefinitionsController {
  constructor(private readonly definitionsService: DefinitionsService) {}

  @Get()
  getDefinitions() {
    return this.definitionsService.getDefinitions();
  }

  @Get(':id')
  getDefinitionById(@Param('id') id: string) {
    return this.definitionsService.getDefinitionById(id);
  }

  @Get('get-by-entry/:id')
  getDefinitionsByEntry(@Param('id') id: string) {
    return this.definitionsService.getDefinitionsByEntry(id);
  }

  @Post()
  createDefinition(@Body() data: CreateDefinitionDto) {
    return this.definitionsService.createDefinition(data);
  }

  @Delete(':id')
  deleteDefinition(@Param('id') id: string) {
    return this.definitionsService.deleteDefinition(id);
  }
}
