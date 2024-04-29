import { ExecutionContext, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { v4 } from 'uuid';
import { AppModule } from '../src/modules/app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

describe('CreditsController (e2e)', () => {
  let app: INestApplication;

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request['user'] = { id: 1 };
      return true;
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/credits/:id (GET)', async () => {
    const id = v4();

    const promises = [
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
      request(app.getHttpServer()).get(`/credits/${id}`).expect(HttpStatus.OK),
    ];
    const result = await Promise.all(promises);

    result.forEach((res) => expect(result[0].text).toBe(res.text));
  });
});
