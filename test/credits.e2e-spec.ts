import { ExecutionContext, INestApplication } from '@nestjs/common';
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
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    console.log(res.body);

    const id = '7a0b8bb4-d3ef-4691-91d0-6ecb5f11ae0d';
    console.log('id: ', id);

    const promises = [
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${v4()}`),
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${v4()}`),
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${v4()}`),
      request(app.getHttpServer()).get(`/credits/${id}`),
      request(app.getHttpServer()).get(`/credits/${v4()}`),
    ];
    const result = await Promise.all(promises);

    console.log(result.map((res) => res.body));

    expect(result.filter((res) => res.body.id === id).length).toBe(6);
  });
});
