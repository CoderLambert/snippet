import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(private prisma: PrismaService) {}

  async create(createSnippetDto: CreateSnippetDto) {
    const { tagIds, categoryId, ...rest } = createSnippetDto;
    return this.prisma.snippet.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        tags: tagIds && tagIds.length > 0 ? { connect: tagIds.map(id => ({ id })) } : undefined,
      },
      include: { tags: true, category: true },
    });
  }

  async findAll() {
    return this.prisma.snippet.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true, category: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.snippet.findUnique({
      where: { id },
      include: { tags: true, category: true },
    });
  }

  async update(id: number, updateSnippetDto: UpdateSnippetDto) {
    const { tagIds, categoryId, ...rest } = updateSnippetDto;
    return this.prisma.snippet.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        ...(tagIds && { tags: { set: tagIds.map(id => ({ id })) } }),
      },
      include: { tags: true, category: true },
    });
  }

  async remove(id: number) {
    return this.prisma.snippet.delete({
      where: { id },
    });
  }

  async searchByLanguage(language: string) {
    return this.prisma.snippet.findMany({
      where: {
        language: {
          contains: language,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { tags: true, category: true },
    });
  }

  async searchByTags(tagIds: number[]) {
    return this.prisma.snippet.findMany({
      where: {
        tags: {
          some: {
            id: { in: tagIds },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { tags: true, category: true },
    });
  }
} 