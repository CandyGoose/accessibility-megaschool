import paramiko
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('212.113.114.44', username='saiko', password='123qweasdzxc', timeout=15)

# Очистить лог
ssh.exec_command('rm -f /tmp/vite.log')

# Запустить vite напрямую - отдельной командой
project_dir = '/home/saiko/Документы/megaschool'
cmd = f'cd "{project_dir}" && nohup /usr/bin/node ./node_modules/.bin/vite --host 0.0.0.0 --port 5173 > /tmp/vite.log 2>&1 &'
print(f"Running: {cmd}")
stdin, stdout, stderr = ssh.exec_command(cmd)
out = stdout.read().decode('utf-8', errors='replace')
err = stderr.read().decode('utf-8', errors='replace')
print(f"Out: {out}")
print(f"Err: {err}")

time.sleep(4)

# Проверить лог
stdin, stdout, stderr = ssh.exec_command('cat /tmp/vite.log 2>/dev/null')
out = stdout.read().decode('utf-8', errors='replace')
print("=== VITE LOG ===")
print(out if out else "(empty)")

# Проверить процессы
stdin, stdout, stderr = ssh.exec_command('ps aux | grep -E "vite|node.*5173" | grep -v grep')
out = stdout.read().decode('utf-8', errors='replace')
print("=== PROCESSES ===")
print(out if out else "(no processes)")

# Проверить порт
stdin, stdout, stderr = ssh.exec_command('ss -tlnp | grep 5173')
out = stdout.read().decode('utf-8', errors='replace')
print("=== PORT 5173 ===")
print(out if out else "(not listening)")

ssh.close()
