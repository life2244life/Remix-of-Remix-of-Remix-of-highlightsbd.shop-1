# MyShop PHP Backend (MySQL)

Hostinger / cPanel er jonno ready PHP REST API. Lovable Cloud / Supabase er bodole MySQL use kore.

## 📁 Structure

```
php-backend/
├── config/database.php      ← DB credentials + JWT secret (EDIT EI FILE)
├── includes/helpers.php     ← CORS, JWT, auth, uuid
├── api/
│   ├── auth.php             ← signup, login, me
│   ├── products.php         ← list/get/create/update/delete
│   ├── orders.php           ← create order, admin list/update
│   ├── upload.php           ← image upload (admin)
│   └── settings.php         ← store/seo/zones/packaging etc
├── uploads/                 ← uploaded images (auto-create)
├── .htaccess
└── index.php                ← API info
```

## 🚀 Hostinger Setup (5 minute)

### 1. Database তৈরি
- cPanel → MySQL Databases
- Database: `u123456789_myshop`
- User: `u123456789_myshop` + strong password
- ALL PRIVILEGES dao

### 2. Schema Import
- phpMyAdmin → tomar database select koro → Import
- `mysql-migration/01-schema.sql` → Go
- `mysql-migration/02-seed-data.sql` → Go
- (Optional) `mysql-migration/03-sample-products.sql`

### 3. PHP Backend Upload
- File Manager → `public_html/` e jao
- `php-backend/` folder upload koro (ZIP kore upload + Extract)
- `php-backend/config/database.php` edit koro:
  ```php
  define('DB_NAME', 'u123456789_myshop');
  define('DB_USER', 'u123456789_myshop');
  define('DB_PASS', 'tomar-actual-password');
  define('JWT_SECRET', 'random-long-string-min-32-char-XYZ123abc...');
  define('CORS_ORIGIN', 'https://tomar-domain.com');
  ```

### 4. Test
Browser e jao: `https://tomar-domain.com/php-backend/`
JSON list dekhabe = ✅ kaj korche

## 🔑 Default Admin Tairi
phpMyAdmin → SQL tab e:
```sql
-- 1. password hash banao (online bcrypt generator) ba ei API call kore:
-- POST /php-backend/api/auth.php?action=signup
-- {"email":"admin@shop.com","password":"YourPass123","full_name":"Admin"}

-- 2. tarpor admin role dao:
INSERT INTO user_roles (id, user_id, role)
SELECT UUID(), id, 'admin' FROM auth_users WHERE email = 'admin@shop.com'
ON DUPLICATE KEY UPDATE role = 'admin';
```

## 🌐 Frontend Connect

`src/lib/api.ts` baniye:
```ts
const API_URL = 'https://tomar-domain.com/php-backend/api';

export async function api(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error');
  return res.json();
}

// Use:
// api('products.php')
// api('auth.php?action=login', { method: 'POST', body: JSON.stringify({email, password}) })
```

## ⚠️ Security Checklist
- [x] Passwords bcrypt hashed
- [x] JWT auth (7 day expiry)
- [x] PDO prepared statements (SQL injection safe)
- [x] uploads/ folder e PHP execution blocked
- [x] config/ + includes/ direct access blocked
- [x] Admin role check via has_role logic
- [ ] **TUMI KORO:** `JWT_SECRET` change koro
- [ ] **TUMI KORO:** `CORS_ORIGIN` e exact domain dao (`*` na)
- [ ] HTTPS enable koro (Hostinger free SSL)

## 📋 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth.php?action=signup` | - | Register |
| POST | `/api/auth.php?action=login` | - | Login → token |
| GET | `/api/auth.php?action=me` | User | Current user |
| GET | `/api/products.php` | - | List all |
| GET | `/api/products.php?slug=xxx` | - | Single product |
| POST | `/api/products.php` | Admin | Create |
| PUT | `/api/products.php?id=xxx` | Admin | Update |
| DELETE | `/api/products.php?id=xxx` | Admin | Delete |
| POST | `/api/orders.php` | Optional | Place order |
| GET | `/api/orders.php?id=xxx` | - | Track order |
| GET | `/api/orders.php` | Admin | All orders |
| PUT | `/api/orders.php?id=xxx` | Admin | Update status |
| POST | `/api/upload.php` | Admin | Upload image |
| GET | `/api/settings.php?type=store` | - | Settings |

## 🔄 Next Steps
1. Frontend e `@/integrations/supabase/client` use ke replace koro `@/lib/api`
2. Edge functions (fraud check, invoice) → similar PHP files banao
3. Pathao courier integration → `api/courier.php` banao
