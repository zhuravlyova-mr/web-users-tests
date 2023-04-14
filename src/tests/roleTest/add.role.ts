const axios = require('axios');

//функция выполняет запросы на добавление профиля админа, авторизацию и добавление роли
const addRole = async() => {
    try {  
           
        try {    //если нужного админа нет, его надо добавить
            await axios
                .post('/profiles/registration', {
                    email: 'user11@mail.ru',
                    password: '12345678',
                    role: 'Admin',
                    name: 'Маша',
                    birthday: '2000.11.20',
                    gender: 'ж',
                    phone: '+79262304051'
            });
        } 
        finally {             //если админ не добавился, значит он существует, можно выполнить
            const res = await axios
            .post('http://localhost:5000/auth/login', 
                {email: 'user11@mail.ru', password: '12345678'}
            );
      
            const response = await axios
                .post('http://localhost:5000/users/role', {value: "User", userId: 1},
                    {headers: { Authorization: `Bearer ${res.data.token}`}});

            return response.data;                
        }    

        
    }

    catch (err) {

    }
}

export default addRole;