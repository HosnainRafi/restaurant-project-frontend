<!-- PROJECT HEADER -->
<p align="center">
  <!-- Replace with an actual banner image in your repo or remove this tag -->
  <img src="https://i.ibb.co.com/5hF4GgvR/Whats-App-Image-2025-09-12-at-00-48-17-0c540ff9.jpg" alt="Urban Grill Banner" width="100%" />
</p>

<h1 align="center">Urban Grill 🍽️</h1>

<p align="center">
  A modern full‑stack restaurant web app for delightful ordering, smart reservations, real‑time order tracking, and powerful admin controls.
</p>

<p align="center">
  <a href="https://urban-grill.vercel.app/">Live Site</a> •
  <a href="https://github.com/HosnainRafi/restaurant-project-frontend">Frontend Repo</a> •
  <a href="https://github.com/HosnainRafi/restaurant-project-backend">Backend Repo</a>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white"></a>
  <a><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <a href="https://vercel.com"><img alt="Deploy" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white"></a>
  <a href="https://www.mongodb.com/"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white"></a>
  <a href="https://stripe.com/"><img alt="Stripe" src="https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white"></a>
</p>

---

## Overview

Urban Grill is a full‑stack restaurant application for customers and
administrators. Customers can browse menus, order and pay via Stripe, reserve
tables, leave reviews, and track orders in real time. Admins manage menu,
orders, reservations, chefs, users, reviews, and analytics via a dedicated
dashboard with charts and status workflows. Real‑time updates are powered by
Socket.IO, and authentication uses Firebase/JWT.

---

## Table of contents

- Features
- Live demo
- Tech stack
- Quick start
  - Prerequisites
  - Clone
  - Backend setup
  - Frontend setup
- Environment variables
- Scripts
- Deployment
- Screenshots
- Project structure
- Contributing
- Credits
- License
- Contact

---

## Features

### Customer

- Browse categories and menu items with search and filtering.
- Featured categories, Chef’s picks, and Today’s specials.
- Secure checkout with Stripe and real‑time order status (Socket.IO).
- Table reservations for individuals or groups; cancel requests to admin.
- Reviews and testimonials; update profile and password.

### Admin

- Dashboard with KPIs, charts, and recent orders.
- Reservations management (approve/decline) with status control.
- Menu management (create/update/delete), feature items and chef
  recommendations.
- Orders management with statuses (confirmed/preparing/cancelled).
- Manage chefs (active/inactive), users (roles), and reviews/testimonials.

---

## Live demo

Open the live app: https://urban-grill.vercel.app/

---

## Tech stack

### Frontend

- React 19, Vite, react-router-dom
- react-hook-form + zod
- Headless UI, Framer Motion, Swiper, Recharts
- Stripe (react-stripe-js), Socket.IO client
- Firebase, Cloudinary
- Axios, react-hot-toast, lucide-react, react-icons, react-datepicker, use-sound

### Backend

- Node.js, Express, MongoDB (Mongoose)
- Socket.IO, Stripe
- Firebase Admin, JWT Authentication, bcrypt
- dotenv, cors, http-status, zod

---

## Quick start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Stripe account + keys
- Firebase project (Web App + Admin SDK)
- Cloudinary account

Notes:

- Ensure CORS is configured to allow the frontend origin.
- For Firebase Admin private keys, escape newlines or load via environment with
  proper formatting.

---

## Scripts

### Backend

- npm run dev → start in development
- npm run start → start in production

### Frontend

- npm run dev → start Vite dev server
- npm run build → production build
- npm run preview → preview production build

---

## Deployment

- Frontend: Vercel (set frontend env vars in Vercel project settings).
- Backend: Render/Heroku/VPS (set environment variables in provider).
- Update VITE_API_URL to the deployed backend URL.
- Configure Stripe webhook (if used) to the backend public URL.
- Set CORS origins to the live frontend domain.

---


## Contributing

Contributions are welcome!
- Fork the repository and create a feature branch.
- Follow conventional commits if possible.
- Open a pull request describing changes and context.

For major changes, please open an issue first to discuss what you’d like to change.

---

## Credits

- Hosnain Rafi – Backend developer ([@hosnainRafi](https://github.com/hosnainRafi))
- Md Asadul Islam – Frontend developer ([@9340](https://github.com/9340))
- Tanvir Ahmmed Sifat – Frontend developer ([@sifat26](https://github.com/sifat26))

---

## License

MIT License. See LICENSE for details.

---

## Contact

Project maintainer: Hosnain Rafi
Email: vibebinary@gmail.com

• Live: https://urban-grill.vercel.app/
• Frontend: https://github.com/HosnainRafi/restaurant-project-frontend
• Backend: https://github.com/HosnainRafi/restaurant-project-backend
