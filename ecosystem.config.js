module.exports = {
  apps: [
    {
      name: 'repo-save-editor',
      script: 'node_modules/.bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      cwd: '/var/www/repo-save-editor',
      env: {
        NODE_ENV: 'production',
        PORT: 4039
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false
    }
  ]
}

