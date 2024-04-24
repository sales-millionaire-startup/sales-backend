import { Controller, Get } from '@nestjs/common';

@Controller('api/user')
export class UserController {
  @Get('')
  async getUser(): Promise<any> {
    return 'vaaax ai ai ai exla martla:1111 sul sxva aris chemi zeca tabadabadaaa';
  }
}
