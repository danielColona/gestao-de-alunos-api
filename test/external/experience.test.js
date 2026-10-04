import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';

describe.only('Matricula de Aluno em Disciplina', () => {

    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        //Arrange: Cadastrar um novo aluno e uma nova disciplina
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Ana222', 
                    email: 'souz322a@example.com', 
                    matricula: '2032226001',
                    senha: '123456'
                });
        const alunoId = cadastroAlunoResposta.body.id;
        console.log('Aluno cadastrado com sucesso. ID:', alunoId);

        const cadastroDisciplina = await request('http://localhost:3000')
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Geogr3afia2',
                    codigo: 'GEO032',
                    cargaHoraria: 60
                 });
        const disciplinaId = cadastroDisciplina.body.id;
        console.log('Disciplina cadastrada com sucesso. ID:', disciplinaId);
       
        //Act: Matricular o aluno na disciplina
        const matriculaResposta = await request('http://localhost:3000')
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    alunoId: alunoId,
                });
        const dataMatricula = matriculaResposta.body.dataMatricula;
        console.log('Aluno matriculado na disciplina com sucesso em: ', dataMatricula);

        //Assert: Verificar se a matrícula foi realizada com sucesso
        expect(matriculaResposta.status).to.equal(201);
        expect(dataMatricula).to.exist;
    })
})