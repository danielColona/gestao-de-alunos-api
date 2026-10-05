import request from 'supertest';
import 'dotenv/config';

export async function getToken(emailUser, passUser) {
    const loginResposta = await request(process.env.BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: emailUser, 
            senha: passUser
        });

    return loginResposta.body.token;
}


let tokenEmCache = null;

export async function comTokenDeAdmin () {
    if (!tokenEmCache) {
        const loginResposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: process.env.ADMIN_EMAIL, 
                senha: process.env.ADMIN_PASSWORD
            });
        
        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;

}