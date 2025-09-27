const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    phone: '9876543210'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.name).toBe('Test User');
            expect(res.body.user.email).toBe('test@example.com');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.name).toBe('Test User');
            expect(res.body.user.email).toBe('test@example.com');
        });
    });
});