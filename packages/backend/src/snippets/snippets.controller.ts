import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  create(@Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(createSnippetDto);
  }

  @Get()
  findAll(
    @Query('language') language?: string,
    @Query('tagIds') tagIds?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    if (language) {
      return this.snippetsService.searchByLanguage(language);
    }
    if (tagIds) {
      const tagIdArray = tagIds.split(',').map(id => Number(id));
      return this.snippetsService.searchByTags(tagIdArray);
    }
    if (categoryId) {
      return this.snippetsService.findAll().then(snippets => snippets.filter(s => s.category?.id === Number(categoryId)));
    }
    return this.snippetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSnippetDto: UpdateSnippetDto,
  ) {
    return this.snippetsService.update(id, updateSnippetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.snippetsService.remove(id);
  }
} 