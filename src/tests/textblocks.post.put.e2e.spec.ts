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
 
  //удалить профиль: нужны права администратора
  it('/POST: textBlock', async () => {
    
    //залогиниться под админом
    const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({email: 'user11@mail.ru', password: '12345678'})
        .expect(201)
    
    //получить токен    
    const token = login.body.token;
 
    //удалить блок (без файла)
    await request(app.getHttpServer())
        .delete('/textblocks/name/some-name')
        .set('Authorization', `Bearer ${token}`);     

    //добавить блок (без файла)
    const block = await request(app.getHttpServer())
        .post('/textblocks')
        .set('Authorization', `Bearer ${token}`)
        .send({name: 'some-name',
               title: 'Что такое моки',
               content: 'Моки - не очень понятные трюки, применяемые в тестировании',
               image: null,
               group: 'main-group'
        })       
        .expect(201)
  
    //изменить профиль    
    const changedBlock = await request(app.getHttpServer())
        .put('/textblocks')
        .set('Authorization', `Bearer ${token}`)
        .send({name: 'some-name',
               title: 'Что такое манго',
               content: 'Манго - оранжевый фрукт, который в спелом виде весьма привлекателен',
               group: 'main-group'
        })     
        .expect(200)
  });

   
  afterAll(async () => {
    await app.close();
  });
    
});
