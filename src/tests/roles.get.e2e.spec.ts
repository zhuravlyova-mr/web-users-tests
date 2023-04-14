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

    //добавить роль админа, если нет
    await request(app.getHttpServer())
       .post('/roles')
       .send({value: 'Admin', description: 'Администратор'})
    
    //добавить роль юзера, если нет   
    await request(app.getHttpServer())
       .post('/roles')
       .send({value: 'User', description: 'Пользователь'})   

    //добавить профиль администратора 
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

     //добавить профиль простого пользователя
    await request(app.getHttpServer())
       .post('/profiles/registration')
       .send({email: 'user14@mail.ru',
              password: '12345678',
              role: 'User',
              name: 'Саша',
              birthday: '2003.11.20',
              gender: 'м',
              phone: '+79282304051'
    });
    
  });
 
  //получить все роли: нужны права администратора 
  it('GET roles', async () => {
    
    //залогиниться под админом
    const login = await request(app.getHttpServer())
       .post('/auth/login')
       .send({email: 'user11@mail.ru', password: '12345678'})
       .expect(201)
    
    //получить токен   
    const token = login.body.token;
  
    //посмотреть все роли
    const res = await request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });


  afterAll(async () => {
    await app.close();
  });
    
});
