# NextJS + Actix Template

A modern full-stack web app template combining [Next.js](https://nextjs.org/) (React frontend) with [Actix Web](https://actix.rs/) (Rust backend). Ideal for building performant, type-safe, and scalable applications.

![License](https://img.shields.io/github/license/AiryyCodes/react-actix-template)  
[➡ View the Repository](https://github.com/AiryyCodes/react-actix-template)

---

## ✨ Features

- ⚡ **High-performance backend** – Rust + Actix Web  
- ⚛️ **Modern frontend** – Next.js App Router, TailwindCSS  
- 🔐 **Authentication-ready** – JWT + Refresh token auth flow  
- 🧠 **Shared types** – Easily share types between client and server  
- 📦 **API routing** – Clean separation between frontend and backend  
- 💡 **Developer-friendly** – Hot reload, simple dev setup  

---

## 📁 Folder Structure

```
react-actix-template/
├── apps/           # Rust backend with Actix Web
│   ├── backend/           # Rust backend with Actix Web
│   │   ├── migrations/ # SQLx migrations
│   │   ├── src/
│   │   └── Cargo.toml
│   └── frontend/          # Next.js frontend with App Router
│       ├── app/
│       ├── components/
│       ├── context/
│       ├── utils/
│       ├── tailwind.config.ts
│       └── next.config.js
├── packages/            # Shared types (if any)
│   └── types/
│       └── src/
├── .env               # Backend environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/) (LTS recommended)
- [PostgreSQL](https://www.postgresql.org/)

---

### 1. Clone the repo

```bash
git clone https://github.com/AiryyCodes/react-actix-template.git
cd react-actix-template
```

---

### 2. Configure environment

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgres://user:password@localhost/database
JWT_SECRET=your_secret_key
FRONTEND_ORIGIN=http://localhost:3000
```

---

### 3. Run the backend

```bash
cargo run
```

> Backend runs on `http://localhost:8000`

---

### 4. Run the frontend

```bash
npm install
npm run web:dev
```

> Frontend runs on `http://localhost:3000`

---

## 📡 API Overview

Example endpoint:

```
GET /
```

Returns:

```json
{
    "name": "NextJS + Actix Template",
    "version": "BACKEND_VERSION"
}
```

Auth endpoints:

- `POST /v1/auth/login`
- `POST /v1/auth/register`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`

---

## 🛠️ Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | React (Next.js App Router)    |
| Styling     | TailwindCSS                   |
| Backend     | Rust, Actix Web, SQLx         |
| Auth        | JWT + Refresh Tokens          |
| Database    | PostgreSQL                    |
| Tooling     | TypeScript, ESLint, Prettier  |

---

## 🐳 Running with Docker

This project includes a Docker Compose setup to simplify running the backend and database.

### 📁 Included Services

- **PostgreSQL** – runs in a container (`db`)
- **Actix backend** – runs in a container (`backend`)
- *(Frontend runs locally using `npm run web:dev`)*

---

### ⚙️ 1. Create `.env`

Create a copy of the example environment:

```bash
cp .env.example .env
```

Make sure your `.env` contains:

```env
DB_USER=website_template
DB_PASSWORD=website_template
DB_DATABASE=website_template
DB_HOST=db
DB_PORT=5432
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}

JWT_SECRET=my_secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

---

### 🐳 2. Start Docker containers

```bash
docker-compose up --build
```

This will:

- Start PostgreSQL (exposed at `localhost:5432`)
- Build and run the Actix backend (`localhost:8080`)

---

### 💻 3. Run the frontend locally

In another terminal:

```bash
cd apps/frontend
npm install
npm run web:dev
```

Frontend will run at: [http://localhost:3000](http://localhost:3000)

---

### 🧼 4. Stopping containers

To stop all services:

```bash
docker-compose down
```

To also remove volumes and networks:

```bash
docker-compose down -v
```

---

## 🤝 Contributing

Pull requests and stars are welcome!

If you find a bug or want to suggest a feature, feel free to open an issue.

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

---

## 👤 Author

**[@AiryyCodes](https://github.com/AiryyCodes)**

