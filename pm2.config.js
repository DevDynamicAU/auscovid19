module.exports = {
  apps : [{
    name: 'auscovid19-server',
    script: '/usr/bin/yarn',
    args: 'server',
    interpreter: 'bash',
    watch: ["./Data"],
    cron_restart: '0 0/8 * * *'
  },
  {
    name: 'auscovid19-client',
    script: '/usr/bin/yarn',
    args: 'build',
    interpreter: 'bash',
    autorestart: false
  },
  {
    name: 'auscovid19-data',
    script: '/ysr/bin/yarn',
    args: 'build:data',
    interpreter: 'bash',

  }
],
};
