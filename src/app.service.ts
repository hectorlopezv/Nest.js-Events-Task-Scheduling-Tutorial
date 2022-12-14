import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CreateUserRequest } from './dto/create-user.request';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private schedule: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }
  async createUser(body: CreateUserRequest) {
    this.logger.log('creating User...', body);
    const userId = '123';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );

    //establish a websocket connect to the user
    const establishWebsocketTimeout = setTimeout(
      () => this.establishWebsocketConnection(userId),
      5000,
    );

    this.schedule.addTimeout(
      `${userId}_establish_ws`,
      establishWebsocketTimeout,
    );
  }
  private establishWebsocketConnection(userId: string) {
    this.logger.log('establishWebsocketConnection', userId);
  }

  @OnEvent('user.created')
  welcomeNewUser(event: UserCreatedEvent) {
    this.logger.log('welcomeNewUser', event);
  }

  @OnEvent('user.created', { async: true })
  async sendWelcomeGift(event: UserCreatedEvent) {
    this.logger.log('welcomeNewUser', event.email);
    this.logger.log('sendWelcomeGift', event.email);
    await new Promise<void>((resolve) => setTimeout(resolve, 3000));
    this.logger.log('this is your welcome gift', event.email);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'deleteExpiredUsers' })
  deleteExpiredUsers() {
    this.logger.log('deleteExpiredUsers');
  }
}
