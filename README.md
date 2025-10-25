# Shop Backend API

Backend API cho ứng dụng Shop được xây dựng với Node.js, Express.js và MongoDB.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Kết nối MongoDB](#kết-nối-mongodb)
- [Seed dữ liệu](#seed-dữ-liệu)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tài khoản mặc định](#tài-khoản-mặc-định)

## 🖥️ Yêu cầu hệ thống

- Node.js (phiên bản 14 trở lên)
- MongoDB (phiên bản 4.4 trở lên)
- npm

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
```

### 2. Cài đặt dependencies

```bash
npm install
```

## ⚙️ Cấu hình

### Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database
MONGO_URI=mongodb://localhost:27017/shop_db

# JWT Secret
SECRET_KEY=your_super_secret_key_here

# Token Expiration
LOGIN_TOKEN_EXPIRATION="30d"  # Days
OTP_EXPIRATION_TIME="120000"  # Milliseconds = 2 phút
PASSWORD_RESET_TOKEN_EXPIRATION="2m"  # Minutes
COOKIE_EXPIRATION_DAYS="30"    # Days

# Email Configuration (cho chức năng OTP và reset password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend Origin
ORIGIN=http://localhost:3000

# Environment
PRODUCTION=false
```

## 🗄️ Kết nối MongoDB
### 1. Sử dụng MongoDB Compass

1. **Mở MongoDB Compass** từ Start Menu hoặc Applications
2. **Kết nối đến local MongoDB:**
   - Hostname: `localhost`
   - Port: `27017`
   - Authentication: None (hoặc username/password nếu đã cấu hình)
3. **Click "Connect"** để kết nối

### 2. Tạo Connection

Trong MongoDB Compass:
1. Click **"Create Connection"**
2. Connection Name: `ProjectConnection`
3. Click **"Save & Connect"**

### 3. Kiểm tra kết nối

MongoDB sẽ chạy trên `mongodb://localhost:27017` mặc định.
Database `<database name>` sẽ được tạo tự động khi chạy ứng dụng lần đầu.

### 4. Quản lý dữ liệu với MongoDB Compass

Sau khi seed dữ liệu, có thể xem và quản lý dữ liệu trong MongoDB Compass:

1. **Xem Collections:** Trong database `<database name>`, sẽ thấy các collections:
   - `db_user` - Thông tin người dùng
   - `db_product` - Sản phẩm
   - `db_category` - Danh mục
   - `db_brand` - Thương hiệu
   - `db_order` - Đơn hàng
   - `db_cart` - Giỏ hàng
   - `db_address` - Địa chỉ
   - `db_review` - Đánh giá
   - `db_wish_list` - Danh sách yêu thích

2. **Xem Documents:** Click vào từng collection để xem dữ liệu

3. **Chỉnh sửa dữ liệu:** Click vào document để chỉnh sửa trực tiếp


## 🗄️ Kết nối với ElasticSearch:
### 1. Tạo ElasticSearch

1. Truy cập vào đường dẫn: **https://www.elastic.co/elasticsearch** được sử dụng miễn phí 14 ngày
2. Tạo một **Hosted deployments** để làm server ElasticSearch

### 2. Kết nối với ElasticSearch

1. Copy url tại **Elasticsearch endpoint** dán vào **ELASTICSEARCH_URL** trong file .env
2. Tạo API key bằng cách nhấn vào nút **Create API key**
3. Copy API key dán vào **ELASTICSEARCH_API_KEY** trong file .env


## 🌱 Seed dữ liệu

### Chạy seed để tạo dữ liệu mẫu:

```bash
npm run seed
```

Lệnh này sẽ tạo:
- Brands (thương hiệu)
- Categories (danh mục)
- Products (sản phẩm)
- Users (người dùng)
- Addresses (địa chỉ)
- Wishlists (danh sách yêu thích)
- Carts (giỏ hàng)
- Reviews (đánh giá)
- Orders (đơn hàng)

## 🏃‍♂️ Reindex dữ liệu

### Chạy reindex để tạo mới dữ liệu hoặc load lại toàn bộ dữ liệu vào ElasticSearch:

```bash
npm run reindex
```

Lệnh này sẽ tạo mới index (nếu chạy lần đầu) và load document vào index đã tạo

## 🏃‍♂️ Chạy ứng dụng

### Development mode (với auto-reload):

```bash
npm run dev
```

Server sẽ chạy trên: `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication & Authorization

API sử dụng JWT token được lưu trong HTTP-only cookies để bảo mật. Có 2 loại middleware:
- `verifyToken`: Xác thực người dùng đã đăng nhập
- `verifyAdmin`: Xác thực người dùng có quyền admin

### Authentication Endpoints

#### 1. Đăng ký
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "Tên người dùng",
  "email": "user@example.com",
  "password": "password123"
}
```

#### 2. Đăng nhập
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. Xác thực OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "otp": "123456"
}
```

#### 4. Gửi lại OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 5. Quên mật khẩu
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 6. Reset mật khẩu
```http
POST /auth/reset-password
Content-Type: application/json

{
  "userId": "user_id_here",
  "token": "reset_token_here",
  "password": "new_password123"
}
```

#### 7. Kiểm tra xác thực
```http
GET /auth/check-auth
Cookie: token=jwt_token_here
```

#### 8. Đăng xuất
```http
GET /auth/logout
```

### User Endpoints

#### User Routes (cần authentication)
```http
GET /users/profile
Cookie: token=jwt_token_here
```

#### Admin-only Routes (cần admin privileges)
```http
GET /users/
Cookie: token=admin_jwt_token_here

PATCH /users/block
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "userId": "id_user_here"
}

PATCH /users/unblock
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "userId": "id_user_here"
}
```

### Product Endpoints

#### Public Routes
```http
GET /products/
GET /products/search
GET /products/:id
```

#### Admin-only Routes
```http
POST /products/create
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "title": "Tên sản phẩm",
  "description": "Mô tả sản phẩm",
  "price": 100000,
  "brand": "brand_id",
  "category": "category_id",
  "thumbnail": "image_url",
  "images": ["image1.jpg", "image2.jpg"],
  "stockQuantity": 50
}

PATCH /products/:id
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "title": "Tên sản phẩm mới",
  "price": 120000
}

DELETE /products/:id
Cookie: token=admin_jwt_token_here

PATCH /products/undelete/:id
Cookie: token=admin_jwt_token_here
```

### Category Endpoints

#### Public Routes
```http
GET /categories/
```

#### Admin-only Routes
```http
POST /categories/
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "name": "Tên danh mục"
}

PATCH /categories/:id
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "name": "Tên danh mục mới"
}

DELETE /categories/:id
Cookie: token=admin_jwt_token_here
```

### Brand Endpoints

#### Public Routes
```http
GET /brands/
```

#### Admin-only Routes
```http
POST /brands/
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "name": "Tên thương hiệu"
}

PATCH /brands/:id
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "name": "Tên thương hiệu mới"
}

DELETE /brands/:id
Cookie: token=admin_jwt_token_here
```

### Order Endpoints

#### Tạo đơn hàng (cần authentication)
```http
POST /orders/create
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "user": "user_id",
  "item": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 100000
    }
  ],
  "address": {
    "street": "123 Main St",
    "city": "Ho Chi Minh",
    "zipCode": "70000"
  },
  "paymentMode": "COD",
  "total": 200000
}
```

**Lưu ý:** Khi tạo order thành công, hệ thống sẽ tự động:
- Tăng `saleCount` của product bằng số lượng đặt hàng
- Giảm `stockQuantity` của product bằng số lượng đặt hàng

#### Lấy đơn hàng theo user (cần authentication)
```http
GET /orders/user
Cookie: token=jwt_token_here
```

#### Yêu cầu hủy đơn hàng (cần authentication)
```http
post /orders/cancel
Cookie: token=jwt_token_here

{
  "id": "order_id"
}
```

#### Admin-only Routes
```http
GET /orders/
Cookie: token=admin_jwt_token_here

PATCH /orders/:id
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "status": "Confirmed"
}
```

### Cart Endpoints

#### Thêm vào giỏ hàng (cần authentication)
```http
POST /cart
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "product": "product_id",
  "quantity": 2
}
```

#### Lấy giỏ hàng (cần authentication)
```http
GET /cart/user
Cookie: token=jwt_token_here
```

#### Cập nhật giỏ hàng (cần authentication)
```http
PATCH /cart/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "quantity": 3
}
```

#### Xóa khỏi giỏ hàng (cần authentication)
```http
DELETE /cart/:id
Cookie: token=jwt_token_here
```

### Address Endpoints

#### Tạo địa chỉ (cần authentication)
```http
POST /address
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "name": "Tên người nhận",
  "phone": "0123456789",
  "address": "Địa chỉ chi tiết",
  "city": "Thành phố",
  "district": "Quận/Huyện"
}
```

#### Lấy địa chỉ theo user (cần authentication)
```http
GET /address/user
Cookie: token=jwt_token_here
```

#### Cập nhật địa chỉ (cần authentication)
```http
PATCH /address/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "name": "Tên mới",
  "address": "Địa chỉ mới"
}
```

#### Xóa địa chỉ (cần authentication)
```http
DELETE /address/:id
Cookie: token=jwt_token_here
```

### Review Endpoints

#### Tạo đánh giá (cần authentication)
```http
POST /reviews/create
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "product": "product_id",
  "rating": 5,
  "comment": "Sản phẩm rất tốt!"
}
```

#### Lấy đánh giá theo sản phẩm (cần authentication)
```http
GET /reviews/product/:id
```

#### Cập nhật đánh giá (cần authentication)
```http
PATCH /reviews/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "product": "product_id",
  "rating": 5,
  "comment": "Sản phẩm rất tốt!"
}
```

#### Xóa đánh giá (cần authentication)
```http
DELETE /reviews/:id
```

### Wishlist Endpoints

#### Thêm vào wishlist (cần authentication)
```http
POST /wishlist
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "product": "product_id",
  "note": "Cần mua sản phẩm này"
}
```

#### Lấy wishlist theo user (cần authentication)
```http
GET /wishlist/user
Cookie: token=jwt_token_here
```

#### Cập nhật wishlist (cần authentication)
```http
PATCH /wishlist/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "product": "product_id",
  "note": "Cần mua sản phẩm này"
}
```

#### Xóa khỏi wishlist (cần authentication)
```http
DELETE /wishlist/:id
Cookie: token=jwt_token_here
```

## 📁 Cấu trúc dự án

```
backend/
├── controllers/         # Logic xử lý request
│   ├── Auth.js          # Xác thực
│   ├── Product.js       # Sản phẩm
│   ├── Category.js      # Danh mục
│   ├── Order.js         # Đơn hàng
│   ├── User.js          # Người dùng
│   ├── Cart.js          # Giỏ hàng
│   ├── Brand.js         # Thương hiệu
│   ├── Address.js       # Địa chỉ
│   ├── Review.js        # Đánh giá
│   └── Wishlist.js      # Danh sách yêu thích
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Brand.js
│   ├── Address.js
│   ├── Review.js
│   ├── Wishlist.js
│   ├── OTP.js
│   └── PasswordResetToken.js
├── routes/              # API routes
│   ├── Auth.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── User.js
│   ├── Cart.js
│   ├── Brand.js
│   ├── Address.js
│   ├── Review.js
│   └── Wishlist.js
├── middleware/          # Middleware functions
│   ├── VerifyToken.js   # JWT verification
│   └── VerifyAdmin.js   # Admin privileges verification
├── utils/               # Utility functions
│   ├── Emails.js        # Email sending
│   ├── GenerateOtp.js   # OTP generation
│   ├── GenerateToken.js # JWT generation
│   └── SanitizeUser.js  # User data sanitization
├── seed/                # Database seeding
│   ├── seed.js
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Brand.js
│   ├── Address.js
│   ├── Review.js
│   └── Wishlist.js
├── services/                    # Services functions
│   ├── AutoConfirmOrder.js      # Tự động xác nhận đơn hàng
│   ├── ProductIndexService.js   # Xử lý việc tạo index và load document lên index trong ElasticSearch
│   ├── Reindex.js               # Nơi gọi reindex
├── database/
│   └── db.js            # Database connection
├── index.js             # Entry point
├── package.json
└── README.md
```

## 👤 Tài khoản mặc định

Sau khi chạy seed, có thể sử dụng các tài khoản sau:

### Admin Account
- **Email:** admin@gmail.com
- **Password:** Admin1234@
- **Role:** Admin (isAdmin: true)

### User Accounts
- **Email:** namnguyen@gmail.com
- **Password:** helloWorld@123
- **Role:** User (isAdmin: false)

- **Email:** minhtran@gmail.com
- **Password:** helloWorld@123
- **Role:** User (isAdmin: false)

## 📝 Ghi chú

- API sử dụng JWT token được lưu trong HTTP-only cookies
- Tất cả endpoints đều hỗ trợ CORS
- Database sử dụng soft delete cho products
- Email configuration cần được setup để sử dụng chức năng OTP và reset password
- Cookie authentication bảo mật hơn Bearer token trong Authorization header
- Admin APIs được bảo vệ bằng middleware `verifyAdmin`