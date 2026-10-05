import request from 'supertest';
import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import { getToken } from '../helpers/auth.js';
import 'dotenv/config';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaMateria } from '../factories/materiasFactory.js';

// Data-Driven Testing: os dados do trabalho entregue vêm do arquivo JSON
const trabalho = JSON.parse(readFileSync(new URL('../fixtures/trabalhoAlunoEntrega.json', import.meta.url), 'utf8'));

describe.only('Entrega de Trabalho pelo Aluno', () => {

    let alunoId;
    let disciplinaId;
    let tokenAluno;

    before(async () => {
        //Arrange: Como admin, cadastrar um novo aluno e uma nova disciplina, matricular o aluno e logar como aluno
        const token = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
        const aluno = novoAluno();

        const cadastroAlunoResposta = await request(process.env.BASE_URL)
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(aluno);

        alunoId = cadastroAlunoResposta.body.id;
        console.log('Aluno cadastrado com sucesso. ID:', alunoId);

        const cadastroDisciplina = await request(process.env.BASE_URL)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(novaMateria());

        disciplinaId = cadastroDisciplina.body.id;
        console.log('Disciplina cadastrada com sucesso. ID:', disciplinaId);

        await request(process.env.BASE_URL)
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                alunoId: alunoId,
            });

        tokenAluno = await getToken(aluno.email, aluno.senha);
    });

    it('Validar que um aluno recém-cadastrado pode registrar a entrega do trabalho', async () => {
        //Act: Registrar a entrega do trabalho como aluno
        const entregaResposta = await request(process.env.BASE_URL)
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAluno}`)
            .send({
                disciplinaId: disciplinaId,
                titulo: trabalho.titulo,
                descricao: trabalho.descricao,
            });

        const dataEntrega = entregaResposta.body.dataEntrega;
        console.log('Trabalho entregue com sucesso em: ', dataEntrega);

        //Assert: Verificar se a entrega foi registrada com sucesso
        expect(entregaResposta.status).to.equal(201);
        expect(dataEntrega).to.exist;
        expect(entregaResposta.body.alunoId).to.equal(alunoId);
        expect(entregaResposta.body.disciplinaId).to.equal(disciplinaId);
        expect(entregaResposta.body.titulo).to.equal(trabalho.titulo);
        expect(entregaResposta.body.status).to.equal('entregue');
    });
});
