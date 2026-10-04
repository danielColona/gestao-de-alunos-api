import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';
import 'dotenv/config';


describe.only('Matricula de Aluno em Disciplina', () => {

    let token;

    beforeEach(async () => {
        token = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    });

    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        //Arrange: Cadastrar um novo aluno e uma nova disciplina
        const cadastroAlunoResposta = await request(process.env.BASE_URL)
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Ana2222222', 
                    email: 'sou222z3233a@example.com', 
                    matricula: '222062336001',
                    senha: '123456'
                });
        const alunoId = cadastroAlunoResposta.body.id;
        console.log('Aluno cadastrado com sucesso. ID:', alunoId);

        const cadastroDisciplina = await request(process.env.BASE_URL)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                    nome: 'Geog3r3a222fia',
                    codigo: 'GEO153',
                    cargaHoraria: 60
                 });
        const disciplinaId = cadastroDisciplina.body.id;
        console.log('Disciplina cadastrada com sucesso. ID:', disciplinaId);
       
        //Act: Matricular o aluno na disciplina
        const matriculaResposta = await request(process.env.BASE_URL)
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
        expect(matriculaResposta.body.alunoId).to.equal(alunoId);
        expect(matriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    })
})