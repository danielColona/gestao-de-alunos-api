import { faker } from '@faker-js/faker';


export function novoAluno() {
    return {
        nome: faker.person.fullName(),
        email: `aluno${Date.now()}@teste.com`,
        matricula: `2020123456${Date.now()}`,
        senha: '123456'
    };
}