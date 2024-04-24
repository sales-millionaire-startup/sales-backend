import { Controller, Get } from '@nestjs/common';

@Controller('api/user')
export class UserController {
  @Get('')
  async getUser(): Promise<any> {
    return 'ai ai ai exla martla: sul sxva aris chemi zeca';
  }
}
