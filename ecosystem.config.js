module.exports = {
  apps: [{
    name: 'pharmacy-frontend',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NUXT_PUBLIC_API_URL: 'http://your-server-ip:3001/api'
    }
  }]
};