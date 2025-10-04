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
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cài đặt dependencies phát triển (tùy chọn)

```bash
npm install -g nodemon
```

## ⚙️ Cấu hình

### 1. Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database
MONGO_URI=mongodb://localhost:27017/shop_db

# JWT Secret
SECRET_KEY=your_super_secret_key_here

# Token Expiration
LOGIN_TOKEN_EXPIRATION=7d
PASSWORD_RESET_TOKEN_EXPIRATION=15m
OTP_EXPIRATION_TIME=300000

# Cookie Settings
COOKIE_EXPIRATION_DAYS=7

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

### 2. Cấu hình MongoDB

Đảm bảo MongoDB đang chạy trên máy local:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## 🗄️ Kết nối MongoDB

### 1. Khởi động MongoDB Service

#### Windows:
```bash
# Khởi động MongoDB service
net start MongoDB

# Hoặc khởi động MongoDB Compass từ Start Menu
```

#### macOS/Linux:
```bash
# Khởi động MongoDB service
sudo systemctl start mongod

# Hoặc sử dụng Homebrew
brew services start mongodb-community
```

### 2. Sử dụng MongoDB Compass

1. **Mở MongoDB Compass** từ Start Menu hoặc Applications
2. **Kết nối đến local MongoDB:**
   - Hostname: `localhost`
   - Port: `27017`
   - Authentication: None (hoặc username/password nếu đã cấu hình)
3. **Click "Connect"** để kết nối

### 3. Tạo Database

Trong MongoDB Compass:
1. Click **"Create Database"**
2. Database Name: `shop_db`
3. Collection Name: `db_user` (hoặc để trống)
4. Click **"Create Database"**

### 4. Kiểm tra kết nối

MongoDB sẽ chạy trên `mongodb://localhost:27017` mặc định.
Database `shop_db` sẽ được tạo tự động khi chạy ứng dụng lần đầu.

### 5. Quản lý dữ liệu với MongoDB Compass

Sau khi seed dữ liệu, bạn có thể xem và quản lý dữ liệu trong MongoDB Compass:

1. **Xem Collections:** Trong database `shop_db`, bạn sẽ thấy các collections:
   - `db_user` - Thông tin người dùng
   - `db_product` - Sản phẩm
   - `db_category` - Danh mục
   - `db_brand` - Thương hiệu
   - `db_order` - Đơn hàng
   - `db_cart` - Giỏ hàng
   - `db_address` - Địa chỉ
   - `db_review` - Đánh giá
   - `db_wishlist` - Danh sách yêu thích

2. **Xem Documents:** Click vào từng collection để xem dữ liệu

3. **Chỉnh sửa dữ liệu:** Click vào document để chỉnh sửa trực tiếp

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

## 🏃‍♂️ Chạy ứng dụng

### Development mode (với auto-reload):

```bash
npm run dev
```

### Production mode:

```bash
npm start
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
  "userId": "user_id_here",
  "otp": "123456"
}
```

#### 4. Gửi lại OTP
```http
POST /auth/resend-otp
Content-Type: application/json

{
  "user": "user_id_here"
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

#### Public Routes (không cần authentication)
```http
GET /users/profile
Cookie: token=jwt_token_here
```

#### Admin-only Routes (cần admin privileges)
```http
GET /users/admin/all
Cookie: token=admin_jwt_token_here

GET /users/admin/:id
Cookie: token=admin_jwt_token_here

PATCH /users/admin/:id
Cookie: token=admin_jwt_token_here

DELETE /users/admin/:id
Cookie: token=admin_jwt_token_here
```

### Product Endpoints

#### Public Routes
```http
GET /products?page=1&limit=10&brand=brand_id&category=category_id&sort=price&order=asc
GET /products/:id
```

#### Admin-only Routes
```http
POST /products
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
GET /categories
```

#### Admin-only Routes
```http
POST /categories
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
GET /brands
```

#### Admin-only Routes
```http
POST /brands
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
POST /orders
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

#### Lấy đơn hàng theo user
```http
GET /orders/user/:userId
Cookie: token=jwt_token_here
```

#### Admin-only Routes
```http
GET /orders?page=1&limit=10
Cookie: token=admin_jwt_token_here

PATCH /orders/:id
Content-Type: application/json
Cookie: token=admin_jwt_token_here

{
  "status": "Dispatched"
}
```

### Cart Endpoints

#### Thêm vào giỏ hàng
```http
POST /cart
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "user": "user_id",
  "product": "product_id",
  "quantity": 2
}
```

#### Lấy giỏ hàng
```http
GET /cart/:userId
Cookie: token=jwt_token_here
```

#### Cập nhật giỏ hàng
```http
PATCH /cart/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "quantity": 3
}
```

#### Xóa khỏi giỏ hàng
```http
DELETE /cart/:id
Cookie: token=jwt_token_here
```

### Address Endpoints

#### Tạo địa chỉ
```http
POST /address
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "user": "user_id",
  "name": "Tên người nhận",
  "phone": "0123456789",
  "address": "Địa chỉ chi tiết",
  "city": "Thành phố",
  "district": "Quận/Huyện"
}
```

#### Lấy địa chỉ theo user
```http
GET /address/:userId
Cookie: token=jwt_token_here
```

#### Cập nhật địa chỉ
```http
PATCH /address/:id
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "name": "Tên mới",
  "address": "Địa chỉ mới"
}
```

### Review Endpoints

#### Tạo đánh giá
```http
POST /reviews
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "user": "user_id",
  "product": "product_id",
  "rating": 5,
  "comment": "Sản phẩm rất tốt!"
}
```

#### Lấy đánh giá theo sản phẩm
```http
GET /reviews/:productId
```

### Wishlist Endpoints

#### Thêm vào wishlist
```http
POST /wishlist
Content-Type: application/json
Cookie: token=jwt_token_here

{
  "user": "user_id",
  "product": "product_id"
}
```

#### Lấy wishlist
```http
GET /wishlist/:userId
Cookie: token=jwt_token_here
```

#### Xóa khỏi wishlist
```http
DELETE /wishlist/:id
Cookie: token=jwt_token_here
```

## 📁 Cấu trúc dự án

```
backend/
├── controllers/          # Logic xử lý request
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
├── middleware/           # Middleware functions
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
├── database/
│   └── db.js            # Database connection
├── index.js             # Entry point
├── package.json
└── README.md
```

## 👤 Tài khoản mặc định

Sau khi chạy seed, bạn có thể sử dụng các tài khoản sau:

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

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB

#### Kiểm tra MongoDB Service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
sudo systemctl start mongod
```

#### Kiểm tra MongoDB Compass:
1. **Mở MongoDB Compass**
2. **Kiểm tra connection string:** `mongodb://localhost:27017`
3. **Nếu không kết nối được:**
   - Kiểm tra MongoDB service có đang chạy không
   - Thử restart MongoDB service
   - Kiểm tra firewall settings

#### Lỗi "Database not found":
- Database `shop_db` sẽ được tạo tự động khi chạy ứng dụng
- Hoặc tạo thủ công trong MongoDB Compass

### Lỗi port đã được sử dụng
```bash
# Tìm process sử dụng port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

### Lỗi dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 🔐 Phân quyền và Bảo mật

### Authentication & Authorization
- **JWT Token**: Được lưu trong HTTP-only cookies để bảo mật tối đa
- **verifyToken**: Middleware xác thực người dùng đã đăng nhập
- **verifyAdmin**: Middleware xác thực người dùng có quyền admin

### Phân quyền API

#### Public APIs (không cần authentication)
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /categories` - Lấy danh mục
- `GET /brands` - Lấy thương hiệu
- `GET /reviews/:productId` - Lấy đánh giá sản phẩm

#### User APIs (cần authentication)
- `GET /users/profile` - Lấy thông tin profile
- `POST /orders` - Tạo đơn hàng
- `GET /orders/user/:userId` - Lấy đơn hàng của user
- Tất cả Cart, Address, Review, Wishlist APIs

#### Admin-only APIs (cần admin privileges)
- `POST /products` - Tạo sản phẩm
- `PATCH /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm
- `POST /categories` - Tạo danh mục
- `PATCH /categories/:id` - Cập nhật danh mục
- `DELETE /categories/:id` - Xóa danh mục
- `POST /brands` - Tạo thương hiệu
- `PATCH /brands/:id` - Cập nhật thương hiệu
- `DELETE /brands/:id` - Xóa thương hiệu
- `GET /users/admin/all` - Lấy tất cả users
- `GET /orders` - Lấy tất cả đơn hàng
- `PATCH /orders/:id` - Cập nhật trạng thái đơn hàng

### Tính năng mới

#### Order Management
- **Tự động cập nhật saleCount**: Khi tạo order, `saleCount` của product sẽ tăng bằng số lượng đặt hàng
- **Tự động giảm stock**: `stockQuantity` sẽ giảm khi có đơn hàng
- **Validation đầy đủ**: Kiểm tra stock, product tồn tại, validation input

#### Admin Features
- **CRUD hoàn chỉnh**: Create, Read, Update, Delete cho Products, Categories, Brands
- **User Management**: Admin có thể xem, cập nhật, xóa users
- **Order Management**: Admin có thể xem và cập nhật trạng thái đơn hàng
- **Referential Integrity**: Không cho phép xóa category/brand đang được sử dụng

## 📝 Ghi chú

- API sử dụng JWT token được lưu trong HTTP-only cookies
- Tất cả endpoints đều hỗ trợ CORS
- Database sử dụng soft delete cho products
- Email configuration cần được setup để sử dụng chức năng OTP và reset password
- Cookie authentication bảo mật hơn Bearer token trong Authorization header
- Admin APIs được bảo vệ bằng middleware `verifyAdmin`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the ISC License.
