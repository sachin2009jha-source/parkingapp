import { Injectable } from '@nestjs/common'
import { add } from '@parkingapp/sample-lib'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!' + add(223, 2)
  }
}
