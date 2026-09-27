FROM node:20-alpine AS builder

WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

COPY backend/ ./backend/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000
CMD ["node", "server.js"]
