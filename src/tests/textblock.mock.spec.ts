//модульный тест
//при удалении возвращает то же имя объекта, который будет удален

import {TextBlockService } from "../textblock/textblock.service";

test('test getProfileByPhone', async () => {
  const textBlockService = new TextBlockService(null, null);  
   
  const result = 'Nest';
  const addMock = jest.spyOn(textBlockService, 'deleteTextBlockByName')
      .mockResolvedValue(result);   
  
  const data = await textBlockService.deleteTextBlockByName('Nest');
  
  expect(addMock).toHaveBeenCalled();
  expect(addMock).toHaveBeenCalledWith('Nest');
  expect(addMock).toBeCalledTimes(1);
  expect(data).toBe('Nest');
});