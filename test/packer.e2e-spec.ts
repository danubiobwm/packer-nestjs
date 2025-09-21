// test/packer.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PackerController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /packer/pack should pack a single product', async () => {
    const body = {
      pedidos: [
        {
          pedido_id: 'pedido1',
          produtos: [
            {
              produto_id: 'prod1',
              dimensoes: { altura: 20, largura: 30, comprimento: 40 },
            },
          ],
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/packer/pack')
      .send(body)
      .expect(201);

    expect(response.body).toEqual({
      pedidos: [
        {
          pedido_id: 'pedido1',
          caixas: [
            {
              caixa_id: expect.any(String),
              produtos: ['prod1'],
            },
          ],
        },
      ],
    });
  });

});