import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTagDto {
  @IsString()
  @IsOptional()
  name?: string;
} 