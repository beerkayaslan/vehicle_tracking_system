/* eslint-disable */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Vehicle } from 'src/entities/vehicle.entity';
import { Location } from 'src/entities/location.entity';
import { VehicleModule } from 'src/modules/vehicle/vehicle.module';
import { LocationModule } from 'src/modules/location/location.module';
import { ConfigModule } from '@nestjs/config';

describe('App E2E (HTTP)', () => {
  let app: INestApplication;
  let vehicleId: string;
  let locationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Vehicle, Location],
          synchronize: true,
        }),
        VehicleModule,
        LocationModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /vehicles yeni araç oluşturur', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles')
      .send({ plateNumber: '34ABC123', driverName: 'Sürücü 1' })
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.plateNumber).toBe('34ABC123');
    vehicleId = res.body.id;
  });

  it('GET /vehicles liste döner', async () => {
    const res = await request(app.getHttpServer()).get('/vehicles').expect(200);
    expect(res.body.total).toBe(1);
    expect(res.body.results[0].id).toBe(vehicleId);
  });

  it('GET /vehicles/:id tek kayıt döner', async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}`)
      .expect(200);
    expect(res.body.result.id).toBe(vehicleId);
  });

  it('GET /vehicles/:id bulunamadığında 404', async () => {
    await request(app.getHttpServer())
      .get('/vehicles/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('POST /locations konum ekler', async () => {
    const res = await request(app.getHttpServer())
      .post('/locations')
      .send({
        vehicleId,
        latitude: 40.12345678,
        longitude: 29.12345678,
        speed: 55,
      })
      .expect(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.vehicleId).toBe(vehicleId);
    locationId = res.body.id;
  });

  it('GET /vehicles/:id/locations aracın konum listesini döner', async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}/locations`)
      .expect(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].id).toBe(locationId);
  });

  it('GET /locations/vehicle/:id aynı konum listesini döner', async () => {
    const res = await request(app.getHttpServer())
      .get(`/locations/vehicle/${vehicleId}`)
      .expect(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].id).toBe(locationId);
  });

  it('GET /locations/vehicle/:id/last son konumu döner', async () => {
    const res = await request(app.getHttpServer())
      .get(`/locations/vehicle/${vehicleId}/last`)
      .expect(200);
    expect(res.body.id).toBe(locationId);
  });
});
