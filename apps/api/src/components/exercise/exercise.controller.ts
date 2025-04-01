import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Role, ROUTES } from '@constants/index';
import { Roles } from '@decorators/roles.decorator';
import { ExerciseService } from '@components/exercise/exercise.service';
import { ExerciseResponseDto } from '@components/exercise/dtos/exercise.dto';

@Controller(ROUTES.EXERCISES)
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Roles(Role.ADMIN)
  @Get()
  getExercises() {
    return this.exerciseService.getExercises();
  }

  @Get(':id')
  getExercise(@Param('id') id: string) {
    return this.exerciseService.getExercise(id);
  }

  @Get('redis/:id')
  getExerciseRedis(@Param('id') id: string) {
    return this.exerciseService.getExerciseRedis(id);
  }

  @Get('  get-by-list/:id')
  getExerciseByList(@Param('id') id: string) {
    return this.exerciseService.getExerciseByList(id);
  }

  @Post('start/:listId')
  startExercise(@Param('listId') listId: string, @Body('userId') userId: string) {
    return this.exerciseService.startExercise(userId, listId);
  }

  @Put('response/:sessionId')
  exerciseResponse(@Param('sessionId') sessionId: string, @Body() data: ExerciseResponseDto) {
    return this.exerciseService.exerciseResponse(sessionId, data);
  }

  @Put('finish/:id')
  finishExercise(@Param('id') id: string) {
    return this.exerciseService.finishExercise(id, false);
  }
}
