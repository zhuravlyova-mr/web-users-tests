//вернуть email для определенного id

import {UsersService } from "../users/users.service";

test('test getUserByIdTest  from UsersService', async () => {
  const usersService = new UsersService(null, null);  
   
  const addMock = jest.spyOn(usersService, 'getUserByIdTest')
      .mockResolvedValue("user11@mail.ru");    
  
  const data = await usersService.getUserByIdTest(2);
  
  expect(addMock).toHaveBeenCalled();
  expect(addMock).toHaveBeenCalledWith(2);
  expect(addMock).toBeCalledTimes(1);
  expect(data).toBe("user11@mail.ru");
});