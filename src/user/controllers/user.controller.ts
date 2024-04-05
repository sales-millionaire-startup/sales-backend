import {Controller, Get} from '@nestjs/common';

@Controller('api/user')
export class UserController {

    @Get("")
    async getUser(): Promise<any> {
        return "Zd user"
    }
}
