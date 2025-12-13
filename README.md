# Online Course Marketplace Microservices

## Project Overview
This project implements a microservice-based online course marketplace. It consists of two microservices:

1. **Course Service**
   - Manages course creation, pricing, inventory (available seats), and instructor ownership.
   - Supports dynamic pricing and atomic seat reservations.

2. **Order Service**
   - Handles student course purchases.
   - Verifies real-time price and seat availability via the Course Service.
   - Implements seat reservation → order creation → reservation confirmation workflow.

This setup ensures **strong data consistency**, **prevents race conditions**, and **handles service failures gracefully**.

---

## ERD
![ERD](https://i.postimg.cc/rszSr65Q/Assignment-ERD.png)


## Key Features

- **Seat Reservation System**  
  Ensures atomic seat deduction and prevents double bookings.

- **Retry & Fallback**  
  Internal service-to-service API calls include retry logic for transient failures.

- **Concurrency Safe**  
  Locking mechanisms are implemented to avoid race conditions during seat reservation.

- **Reservation Expiry**  
  A cron job automatically releases seats if reservations are not confirmed within a defined time.

- **Health Check**  
  Each microservice exposes a dedicated health endpoint for monitoring.

- **Dockerized Architecture**  
  All services run in isolated Docker containers and communicate over a shared Docker network.


## Technical Stack
- **Node.js + Express.js** for microservices
- **Docker + Docker Compose** for containerization and orchestration
- **Axios** for internal service communication
- **In-memory data storage** (no database required for this assignment)

---

## Folder Structure
```
course-service
├── dist/               # Compiled JavaScript output (after build)
├── node_modules/       # Project dependencies
├── src/                # Application source code
│ ├── controllers.ts    # Handles incoming API requests
│ ├── cron.ts           # Cron jobs (reservation expiry, cleanup tasks)
│ ├── routes.ts         # API route definitions
│ ├── services.ts       # Business logic (seat reservation, pricing)
│ ├── models.ts         # Data models / in-memory storage
│ ├── interface.ts      # TypeScript interfaces & types
│ └── index.ts          # Application entry point
├── .dockerignore       # Files ignored by Docker
├── .gitignore          # Files ignored by Git
├── Dockerfile          # Docker build configuration
├── package-lock.json   # Locked dependency versions
├── package.json        # Project metadata & scripts
└── tsconfig.json       # TypeScript configuration

order-service
├── dist/               # Compiled JavaScript output (after build)
├── node_modules/       # Project dependencies
├── src/                # Application source code
│ ├── controllers.ts    # Request handlers (business logic entry points)
│ ├── routes.ts         # API route definitions
│ ├── services.ts       # Core business logic & service layer
│ ├── models.ts         # Data models / schemas
│ ├── interface.ts      # TypeScript interfaces & types
│ └── index.ts          # Application entry point
├── .dockerignore       # Files ignored by Docker
├── .env                # Environment variables (local)
├── .env.example        # Example env file for setup
├── .gitignore          # Files ignored by Git
├── Dockerfile          # Docker build configuration
├── package-lock.json   # Locked dependency versions
├── package.json        # Project metadata & scripts
└── tsconfig.json       # TypeScript configuration
```

---

## Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/junayednoman/microservice-assignment
cd microservice-assignment
```

2. **Create .env file in the Order Service**
```bash
COURSE_API_URL=http://course-service:5001/api/courses
```

3. **Build and run services with Docker Compose**
```bash
docker compose up -d --build
```

4. **Stop services**
```bash
docker-compose down
```

##  Microservice APIs

### Course Service

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/courses` | Create a new course |
| GET | `/api/courses/:id` | Get a single course |
| PATCH | `/api/courses/:id/price` | Update course price |
| PATCH | `/api/courses/:id/reserveSeat` | Reserve a seat atomically |
| PATCH | `/api/courses/:reservationId/confirmReservation` | Confirm a reservation |
| PATCH | `/api/courses/:reservationId/cancelReservation` | Cancel a reservation |
| GET | `/api/health` | Health check |

### Order Service

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/orders` | Create a new order (handles reservation & confirmation) |
| GET | `/api/health` | Health check |


## How to Test

1. Start services via Docker Compose.
2. Use Postman to:
 - Create courses in Course Service.
 - Reserve and confirm seats.
 - Place orders via Order Service.
3. Test race conditions by simulating multiple users trying to reserve the last seat simultaneously.
4. Check health endpoints:
 - ``` http://localhost:5001/api/health ```
 - ``` http://localhost:5002/api/health ```

## Notes

- No database is used; in-memory storage is implemented for simplicity.
- Services communicate using Docker network: ```COURSE_API_URL=http://course-service:5001/api/courses```
- Cron jobs handle automatic expiration of reserved seats to prevent ghost reservations.

**Built with ❤️ by [Junayed Noman](https://junayednoman.vercel.app)**