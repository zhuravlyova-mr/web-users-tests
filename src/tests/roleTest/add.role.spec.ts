//тест на добавление роли пользователю ( с помощью axios - похоже на e2e)
//требуется предварительный запуск приложения в другом терминале:
//можно написать в терминале: node build
// приложение (т.е. сервер) запустится через shell
import axios from 'axios';
import addRole from './add.role';

describe( 'Add the role to user', () => {
    let response: any;
    beforeAll( () => {
        response = {
            data:{value: "User", userId: 1}
        }
    }) 
    test('On success returns the same', async () => {
        const data = await addRole();
        expect(data).toEqual(response.data);
    })
})