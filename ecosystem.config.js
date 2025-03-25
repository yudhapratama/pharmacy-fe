export default {
  apps: [{
    name: 'pharmacy-frontend',
    script: '.output/server/index.mjs',
    instances: '1',
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};