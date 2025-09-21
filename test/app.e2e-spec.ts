// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) should return 404 for unknown route', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

  it('/packer/pack (POST) should be available', () => {
    return request(app.getHttpServer())
      .post('/packer/pack')
      .send({ pedidos: [] })
      .expect(201);
  });
});