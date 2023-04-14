//e2e-тест
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
//import { UsersService } from '../../users/users.service';

describe('Authentication test', () => {
  let app: INestApplication;
  //let usersService: UsersService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    //предварительно создать профиль
    await request(app.getHttpServer())
    .post('/profiles/registration')
    .send({email: 'user11@mail.ru',
           password: '12345678',
           role: 'Admin',
           name: 'Маша',
           birthday: '2000.11.20',
           gender: 'ж',
           phone: '+79262304051'
    });
    
  });

  //проверка аутентификации
  it('POST: login', async () => {
    const res = await request(app.getHttpServer())
       .post('/auth/login')
       .send({email: 'user11@mail.ru', password: '12345678'})
       .expect(201);
       expect(res.body.token).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
    
});
