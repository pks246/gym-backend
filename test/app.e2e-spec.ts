/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { beforeEach, afterEach, describe, it } from '@jest/globals';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from './../src/app.config';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = configureApp(moduleFixture.createNestApplication());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users (POST) should reject invalid payloads', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: '',
        email: 'not-an-email',
        extraField: 'not allowed',
      })
      .expect(400);
  });

  it('/gyms (POST) should reject invalid nested payloads', () => {
    return request(app.getHttpServer())
      .post('/gyms')
      .send({
        code: 'downtown',
        name: '',
        contactEmail: 'invalid-email',
        amenities: [{ name: '' }],
        operatingHours: [{ dayOfWeek: 9, openTime: '25:00' }],
      })
      .expect(400);
  });

  it('/members (POST) should reject invalid member payloads', () => {
    return request(app.getHttpServer())
      .post('/members')
      .send({
        gymId: 0,
        memberCode: 'member-1',
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        joinedOn: 'not-a-date',
        emergencyContacts: [{ name: '', relationship: '', phoneNumber: '' }],
      })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
