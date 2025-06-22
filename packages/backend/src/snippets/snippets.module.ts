import { Module } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { SnippetsController } from './snippets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
// 预留 Tag/Category

@Module({
  imports: [PrismaModule],
  controllers: [SnippetsController, TagController, CategoryController],
  providers: [SnippetsService, TagService, CategoryService],
})
export class SnippetsModule {} 