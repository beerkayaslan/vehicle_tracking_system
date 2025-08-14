# Vehicle Tracking System

Lojistik firması için araç takip sistemi case study'si.

## Kurulum

### Geliştirme Ortamı

```bash
git clone <repo-url>
cd vehicle-tracking-system
npm install
docker-compose up -d
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:production
```

### Docker Production

```bash
docker-compose --profile production up -d
```

## Digital Ocean App Platform Deployment

### Otomatik Deployment

Bu proje Digital Ocean App Platform için optimize edilmiştir. `app.yaml` dosyası ile otomatik deploy edilebilir.

1. GitHub repo'yu Digital Ocean App Platform'a bağlayın
2. `app.yaml` dosyası otomatik olarak algılanacaktır
3. Environment variables ayarlayın:
   - `NODE_ENV=production`
   - `PORT=8080` (DO otomatik ayarlar)

### Health Check Endpoints

- `/health` - Genel health check
- `/readiness` - Readiness probe için
- `/liveness` - Liveness probe için

### Build & Deploy Komutları

- Build: `npm ci && npm run build`
- Start: `npm run start:production`

## Görevler

1. **API Endpoints'leri Tamamlayın**
   - GET /vehicles - Tüm araçları listele
   - POST /vehicles - Yeni araç kaydet
   - POST /locations - Yeni lokasyon kaydet
   - GET /locations/vehicle/:vehicleId - Araç lokasyonlarına ait geçmiş bilgileri dön

2. **WebSocket Implementasyonu**
   - location-update event'ini handle edin
   - Tüm istemcilere broadcast yapın

3. **Validation ve Error Handling**
   - DTO'larda uygun validation ekleyin
   - Hata durumlarını handle edin

3. **Veritabanı Şeması**
   - Vehicle entitysi oluşturun
   - Location entitysi oluşturun

4. **Performance Optimizasyonu**
   - Database query'lerinizi optimize edilmiş şekilde yazın
   - Memory management'a dikkat edin
   - Memory Leak'i bulun ve Fixleyin (Bonus)

5. **Test Yazın**
   - Unit testler ve e2e testler ekleyin

## Test

```bash
npm run test
npm run test:e2e
```

## Teslim

- NestJS + TypeScript + PostgreSQL tech stacklerini kullanılacak.
- Çalışan projeyi GitHub'a yükleyip link gönderin.
- Docker ile ayağa kalkan, API'ları çalışan bir sistem olmalı.
- Süre: 48 saat

## Teslim gereksinimleri

git clone [repo-url]
cd vehicle-tracking-system
docker-compose up -d

# Test
curl http://localhost:3000/vehicles

**UYARI**: Aşağıdaki kod örneklerinde hatalı kısımlar olabilir. Tespit ederseniz hatalı olan kısımları ve çözümlerini kod içerisinde yorum satırı içerisinde belirtin.

**AI Kullanım Yasağı**
ChatGPT, Claude, GitHub Copilot gibi AI araçları kullanımı yasaktır.
**İzin verilen**: IDE auto-completion, Stack Overflow, resmi dokümantasyonlar