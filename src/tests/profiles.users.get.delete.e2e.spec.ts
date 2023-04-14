//e2e-тест
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Mixed test: working with roles/profiles/auth', () => {
  let app: INestApplication;
  let profilesService = { getAllProfiles: () => [
    {
      "id": 1,
      "name": "Маша",
      "birthday": "2000-11-19T21:00:00.000Z",
      "gender": "ж                                                                                                                                                                                                                                                              ",
      "phone": "+79262304051",
      "userId": 1,
      "user": {
          "id": 1,
          "email": "user11@mail.ru",
          "password": "$2a$05$inl7eDCVN84oiF459C4hj.T8Acohr2KnAud5PkoTR5N8lwm5YaC/q",
          "banned": false,
          "banReason": null
      }
  },
  {
      "id": 2,
      "name": "Саша",
      "birthday": "2003-11-19T21:00:00.000Z",
      "gender": "м                                                                                                                                                                                                                                                              ",
      "phone": "+79282304051",
      "userId": 2,
      "user": {
          "id": 2,
          "email": "user14@mail.ru",
          "password": "$2a$05$z2z2CSUnCuK88HGhhb77GeI/./fOLCJH6ixZiYSQwF763lMB0SQaO",
          "banned": false,
          "banReason": null
      }
  }
]};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
        .post('/profiles/registration')
        .send({email: 'userToDelete@mail.ru',
           password: '55555555',
           role: 'User',
           name: 'Noname',
           birthday: '1000.11.20',
           gender: 'м',
           phone: '+73003040511'
    });

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
 
  //посмотреть все профили, удалить профиль: нужны права администратора
  it('GET - DELETE: profile', async () => {
    
    //залогиниться под админом
    const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send({email: 'user11@mail.ru', password: '12345678'})
        .expect(201)
    
    //получить токен    
    const token = login.body.token;

    //посмотреть профили
    const profiles = await request(app.getHttpServer())
        .get('/profiles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      
    //удалить профиль    
    const res = await request(app.getHttpServer())
        .delete('/profiles')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'userToDelete@mail.ru'})
        .expect(200);

    //снова посмотреть профили с получением данных*
    const profilesAfter = await request(app.getHttpServer())
        .get('/profiles')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
         
        //*чтобы получить данные, нужно выполнить npm run test дважды:
        //в первый раз на пустой базе, затем получить профили (localhost:5000/profiles),
        //например, в браузере, заменить ими старые данные в переменной profilesService выше
        //и снова запустить тесты, раскомментировав строку ниже
        
        //expect(profilesAfter.body).toEqual(profilesService.getAllProfiles());
  });
  
  afterAll(async () => {
    await app.close();
  });
    
});
