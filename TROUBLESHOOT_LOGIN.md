# Troubleshooting Login - Stuck di Login Page

## Gejala

- Username dan password sudah benar
- Klik "Sign In" tapi stuck di login page
- Tidak ada error message muncul
- Loading indicator mungkin terus muncul

## Kemungkinan Penyebab

### 1. Frontend tidak running atau perlu restart

### 2. Browser cache lama

### 3. Backend tidak terkoneksi dari frontend

### 4. CORS issue

### 5. Environment variable tidak ter-load

---

## ✅ LANGKAH PERBAIKAN

### Langkah 1: Restart Backend

```powershell
# Stop backend jika running (Ctrl+C di terminal backend)
cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe
npm run dev
```

**Pastikan muncul:**

```
API & WS running on http://localhost:2000
✓ Hourly report scheduler initialized
✓ Daily report scheduler initialized
```

### Langkah 2: Restart Frontend

```powershell
# Stop frontend jika running (Ctrl+C di terminal frontend)
cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend
npm run dev
```

**Pastikan muncul:**

```
VITE ready in xxx ms
Local: http://localhost:5173/
Network: http://10.125.48.102:30/
```

### Langkah 3: Clear Browser Cache & Hard Reload

**Chrome/Edge:**

1. Buka DevTools (F12)
2. Klik kanan tombol refresh
3. Pilih "Empty Cache and Hard Reload"

**Atau:**

- Windows: `Ctrl + Shift + Delete` → Pilih cache → Clear

### Langkah 4: Test dengan Browser Console Terbuka

1. Buka http://10.125.48.102:30/login
2. Tekan F12 untuk DevTools
3. Buka tab **Console**
4. Masukkan credentials:
   - Username: `admin`
   - Password: `admifm`
5. Klik Sign In
6. **PERHATIKAN LOG DI CONSOLE!**

**Log yang HARUS muncul jika berhasil:**

```
🚀 Form submitted
📝 Calling login with: admin
🔐 Login attempt: {username: "admin", API_URL: "http://10.125.48.102:2000/api"}
📡 Sending request to: http://10.125.48.102:2000/api/auth/login
✅ Login response: {success: true, message: "Login successful", user: {...}, token: "..."}
✅ Response keys: ['success', 'message', 'user', 'token']
✅ Response success: true
✅ Response user: {id: 1, username: "admin", ...}
✅ Response token: Token exists
✅ Setting currentUser: {id: 1, username: "admin", ...}
💾 Auth state saved to localStorage
🔑 Authorization header set
💾 Auth state saved, user: admin
✅ isAuthenticated: true
📊 Login result: {success: true, message: "Login successful"}
✅ Login successful, redirecting to /app/global
✅ Navigation complete
```

### Langkah 5: Periksa Network Tab

1. Buka DevTools (F12)
2. Tab **Network**
3. Filter: XHR
4. Klik Sign In
5. Cari request ke `/auth/login`

**Check:**

- ✅ Status: 200 OK
- ✅ Response: `{"success":true,"user":{...},"token":"..."}`
- ❌ Status: 500/404 → Backend bermasalah
- ❌ Status: 401 → Password salah
- ❌ Failed/CORS → Network/CORS issue

---

## 🔧 JIKA MASIH STUCK

### Debug A: Test API Langsung

```powershell
Invoke-RestMethod -Uri "http://10.125.48.102:2000/api/auth/login" `
  -Method Post `
  -Body (@{username="admin"; password="admifm"} | ConvertTo-Json) `
  -ContentType "application/json"
```

**Expected output:**

```
success message          user                                                                 token
------- -------          ----                                                                 -----
   True Login successful @{id=1; username=admin; name=System Administrator; ...}             eyJhbGciOi...
```

### Debug B: Check .env File

```powershell
cat C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend\.env
```

**Should be:**

```
VITE_API_URL=http://10.125.48.102:2000/api
```

### Debug C: Check LocalStorage

Di browser console:

```javascript
localStorage.getItem("auth_state");
```

Jika ada data lama, clear:

```javascript
localStorage.clear();
```

### Debug D: Check CORS di Backend

File: `pisifmbe/src/index.ts`

Pastikan ada:

```typescript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:30",
      "http://10.125.48.102:30",
      "http://10.125.48.102",
    ],
    credentials: true,
  })
);
```

---

## 📋 CHECKLIST SEBELUM TEST

- [ ] Backend running di port 2000
- [ ] Frontend running di port 30
- [ ] .env file benar
- [ ] Browser cache di-clear
- [ ] DevTools Console terbuka
- [ ] DevTools Network tab terbuka
- [ ] Username: `admin`
- [ ] Password: `admifm`

---

## 🆘 MASIH GAGAL?

### Error Patterns:

**1. "Login result: undefined"**

- Backend tidak merespons
- Check backend logs
- Check network connectivity

**2. Stuck dengan loading spinner**

- Frontend tidak menerima response
- Check browser console untuk error
- Check network tab untuk failed request

**3. "Login failed: undefined"**

- Response format salah
- Check backend response structure
- Update frontend auth.ts jika perlu

**4. Page tidak redirect**

- Navigation guard memblokir
- Check console untuk router errors
- Verify isAuthenticated value

---

## 📞 Contact Developer

Jika semua langkah sudah dicoba dan masih gagal, screenshot:

1. Browser console logs
2. Network tab dengan request/response detail
3. Backend terminal output

Dan kirimkan ke developer untuk debugging lebih lanjut.
