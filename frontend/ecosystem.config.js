module.exports = [{
  script: 'server.js',
  name: 'IZING-frontend',
  exec_mode: 'cluster',
  cron_restart: '00 00 * * *',
  instances: 1,
  watch: false
}]
