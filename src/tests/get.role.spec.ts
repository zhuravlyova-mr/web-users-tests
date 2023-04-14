//модульный тест для контроллера
import { RolesService } from "../roles/roles.service";
import { RolesController} from "../roles/roles.controller";

//проверяется, что контроллер правильно отрабатывает на getRoleByValue
//используется копия функции с заглушкой для базы данных
describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;
  beforeEach(() => {
    rolesService = new RolesService(null);
    rolesController = new RolesController(rolesService);
  });
  describe('getRoleByValue (for test)', () => {
    it('Should return info about role Admin', async () => {
      const result = { "id": 1, "value": "Admin", "description": "Администратор"};
      jest.spyOn(rolesService, 'getRoleByValueTest').mockImplementation(
        async () => result);
      expect(await rolesController.getByValueTest('Admin')).toBe(result);
    });
  });
});

