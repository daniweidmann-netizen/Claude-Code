# TrueReel – Produktions-Container (Frontend + API + FFmpeg)
FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && apt-get clean
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Öffentliche Supabase-Werte setzt der Server zur Laufzeit ein (keine Build-Variablen nötig)
RUN npm run build && npm prune --omit=dev
ENV NODE_ENV=production PORT=8787
EXPOSE 8787
CMD ["node", "server/index.js"]
