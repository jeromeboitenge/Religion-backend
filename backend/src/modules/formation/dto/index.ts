import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuizAttemptDto {
  @ApiProperty({ type: [Number], description: 'Array of answer indices' })
  @IsArray()
  answers: number[];
}
