import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Role, ROUTES } from '@constants/index';
import { PracticeService } from '@components/practice/practice.service';
import { PracticeResponseDto } from '@components/practice/dtos/practice.dto';
import { Roles } from '@decorators/roles.decorator';

@Controller(ROUTES.PRACTICE)
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Roles(Role.ADMIN)
  @Get('sessions')
  getPracticeSessions() {
    return this.practiceService.getPracticeSessions();
  }

  @Get('sessions/:id')
  getPracticeSession(@Param('id') id: string) {
    return this.practiceService.getPracticeSession(id);
  }

  @Get('sessions/redis/:id')
  getPracticeSessionRedis(@Param('id') id: string) {
    return this.practiceService.getPracticeSessionRedis(id);
  }

  @Get('sessions/get-by-list/:id')
  getPracticeSessionByList(@Param('id') id: string) {
    return this.practiceService.getPracticeSessionByList(id);
  }

  @Post('start-list/:listId')
  startListPracticeSession(@Param('listId') listId: string, @Body('userId') userId: string) {
    return this.practiceService.startListPracticeSession(userId, listId);
  }

  @Put('response/:sessionId')
  practiceResponse(@Param('sessionId') sessionId: string, @Body() data: PracticeResponseDto) {
    return this.practiceService.practiceResponse(sessionId, data);
  }

  @Put('finish/:id')
  finishPracticeSession(@Param('id') id: string) {
    return this.practiceService.finishPracticeSession(id, false);
  }
}
