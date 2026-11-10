# TrueReel – Produktions-Container (Frontend + API + FFmpeg)
FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && apt-get clean
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_* Variablen werden beim Build ins Frontend eingebettet
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
RUN npm run build && npm prune --omit=dev
ENV NODE_ENV=production PORT=8787
EXPOSE 8787
CMD ["node", "server/index.js"]
