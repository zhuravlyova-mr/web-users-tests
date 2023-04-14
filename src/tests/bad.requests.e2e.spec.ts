//e2e-тест
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Mixed test: working with roles/profiles/auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });
 
  //посмотреть ответы на ошибки в запросах
  it('Bad requests', async () => {
    
    //попытка зарегистрировать профиль с неправильными данными
    const profile = await request(app.getHttpServer())
        .post('/profiles/registration')
        .send({email: 'incorrectmail.ru',
            password: '55555',
            role: 'User',
            name: 'Noname',
            birthday: '2000.11.20',
            gender: 'ж',
            phone: '+!73003040511'
        })
        .expect(400);

    //залогиниться под неизвестным пользователем
    const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({email: 'user500@mail.ru', password: '12345678'})
        .expect(401)
    
    //посмотреть профили без авторизации
    const profiles = await request(app.getHttpServer())
        .get('/profiles')
        .expect(401)

    //залогиниться под админом
    const rightLogin = await request(app.getHttpServer())
        .post('/auth/login')
        .send({email: 'user11@mail.ru', password: '12345678'})
        .expect(201)
    
    //получить токен    
    const token = rightLogin.body.token;
 
    //попытка удалить блок по неправильному адресу (namename)
    await request(app.getHttpServer())
        .delete('/textblocks/namename/some-name')
        .set('Authorization', `Bearer ${token}`)     
        .expect(404)
  
  });  

  afterAll(async () => {
    await app.close();
  });
    
});
