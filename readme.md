cannolli furniture




canolli-frontend/
│
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
│
├── src/
│
│   ├── app/
│   │   ├── store.js
│   │   └── rootReducer.js
│
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── videos/
│
│   ├── components/
│   │
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── RatingStars.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AdminSidebar.jsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── RelatedProducts.jsx
│   │   │   └── ReviewCard.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminHeader.jsx
│   │       ├── DashboardCard.jsx
│   │       └── DataTable.jsx
│
│   ├── pages/
│   │
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   └── ForgotPassword.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── Profile.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   └── Addresses.jsx
│   │   │
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── AddProduct.jsx
│   │       ├── EditProduct.jsx
│   │       ├── Users.jsx
│   │       ├── Orders.jsx
│   │       ├── Categories.jsx
│   │       └── Banners.jsx
│
│   ├── features/        (Redux Toolkit slices)
│   │   ├── auth/
│   │   │   └── authSlice.js
│   │   │
│   │   ├── products/
│   │   │   └── productSlice.js
│   │   │
│   │   ├── cart/
│   │   │   └── cartSlice.js
│   │   │
│   │   ├── orders/
│   │   │   └── orderSlice.js
│   │   │
│   │   └── admin/
│   │       └── adminSlice.js
│
│   ├── services/        (API Calls)
│   │   ├── axiosInstance.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   └── adminService.js
│
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useDebounce.js
│
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── AdminLayout.jsx
│
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── generateSlug.js
│   │   ├── constants.js
│   │   └── helpers.js
│
│   ├── config/
│   │   └── env.js
│
│   ├── styles/
│   │   ├── index.css
│   │   └── tailwind.css
│
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── vite.config.js
└── package.json