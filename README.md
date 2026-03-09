# KLON4

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

> ⚡ Bu proje **statik bir site** olduğu için Vercel'e doğrudan deploy edilebilir. `vercel.json` zaten SPA yönlendirmesi için ayarlı.

## 🚀 GitHub'dan Vercel'e Deployment Rehberi

### 1. GitHub'a Projeyi Kaydetme
1. Chat ekranında **"Save to GitHub"** butonuna tıklayın
2. Yeni veya mevcut bir repository seçin
3. Branch seçin (genellikle `main` veya `master`)
4. **"PUSH TO GITHUB"** butonuna tıklayın

### 2. Vercel'e Import Etme (Frontend)
1. https://vercel.com adresine gidin ve giriş yapın
2. **"New Project"** veya **"Add New..."** → **"Project"** tıklayın
3. GitHub hesabınızı bağlayın
4. Repository'nizi seçin
5. **Framework Preset:** "Vite" veya "React" otomatik algılanır
6. **Root Directory:** Frontend klasörünüzü seçin (örn. `frontend` veya `/`)
7. **Build Settings:**
   - Build Command: `npm run build` veya `yarn build`
   - Output Directory: `dist` veya `build`
8. **Deploy** butonuna tıklayın

### 3. ⚠️ ÖNEMLİ: Backend (FastAPI) Sorunu
Vercel **öncelikle frontend** için tasarlanmıştır. Python/FastAPI desteği **sınırlıdır** (serverless functions olarak çalışır, tam FastAPI uygulaması için ideal değildir).

#### Önerilen Çözüm
Backend'i ayrı bir platformda barındırın.

**Backend İçin Önerilen Platformlar:**
- Render.com (ücretsiz tier var, Python desteği mükemmel)
- Railway.app (kolay deployment)
- Fly.io (global edge network)
- Heroku (klasik ama artık ücretli)

### 4. Backend'i Render'da Deploy Etme (Örnek)
1. https://render.com adresine gidin
2. **"New +"** → **"Web Service"**
3. GitHub repository'nizi bağlayın
4. **Settings:**
   - Name: Backend ismi
   - Environment: **Python 3**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend` veya backend klasörünüz
5. **Environment Variables** ekleyin (MongoDB URL vb.)
6. **Create Web Service**

### 5. Environment Variables (Çevre Değişkenleri)

**Vercel'de (Frontend):**
- Project Settings → **Environment Variables**
- Ekleyin:
  ```
  VITE_API_URL=https://your-backend-url.onrender.com
  ```

**Render'da (Backend):**
- Environment → **Environment Variables**
- Ekleyin:
  ```
  MONGODB_URI=your_mongodb_connection_string
  PORT=10000
  ```

### 6. Domain ve Preview Doğrulama

**Vercel:**
- Her commit'te otomatik **preview deployment** oluşturur
- Production URL: `your-project.vercel.app`
- Custom domain ekleyebilirsiniz: Project Settings → Domains

**Render:**
- URL: `your-service.onrender.com`
- İlk deployment ~5-10 dakika sürebilir

### 7. Frontend-Backend Bağlantısını Test Etme
1. Vercel'deki frontend URL'inizi açın
2. Browser console'u açın (F12)
3. API çağrılarının backend URL'inize gittiğini kontrol edin
4. CORS hatası varsa, backend'de CORS ayarlarını kontrol edin:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend.vercel.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 🚨 Sık Yapılan Hatalar ve Çözümler

| Hata | Çözüm |
|------|-------|
| **Build failed** | `package.json` ve `requirements.txt` dosyalarının doğru olduğunu kontrol edin |
| **CORS error** | Backend'de CORS middleware'i düzgün ayarlayın |
| **Environment variables not working** | Değişken isimlerini kontrol edin (frontend: `VITE_` prefix, backend: doğrudan isim) |
| **Backend timeout** | Render free tier ~15s inactive sonra uyur, ilk istek yavaş olabilir |
| **404 on refresh** | Vercel'de SPA routing için `vercel.json` ekleyin |

## 📝 Vercel.json Örneği (SPA Routing İçin)

Frontend root'una ekleyin:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## ✅ Son Kontrol Listesi

- [ ] GitHub'a kod başarıyla push edildi
- [ ] Frontend Vercel'de deploy edildi
- [ ] Backend ayrı platformda (Render vb.) deploy edildi
- [ ] Environment variables her iki tarafta da ayarlandı
- [ ] Frontend, backend URL'ine başarıyla bağlanıyor
- [ ] CORS ayarları doğru
- [ ] Custom domain (opsiyonel) bağlandı

---

**İhtiyacınız olan herhangi bir adımda takılırsanız, lütfen hangi aşamada olduğunuzu belirtin, size daha detaylı yardımcı olabilirim!** 🚀
