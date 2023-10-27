import os
import subprocess

if os.path.exists('instance') and os.path.exists('__pycache__') and os.path.exists('migrations'):
    subprocess.Popen(['rm', '-rf', 'instance'])
    subprocess.Popen(['rm', '-rf', '__pycache__'])
    subprocess.Popen(['rm', '-rf', 'migrations'])

subprocess.run(['flask', 'db', 'init'])
subprocess.run(['flask', 'db', 'migrate', '-m', '"db populate"'])
subprocess.run(['flask', 'db', 'upgrade'])
subprocess.run(['python', 'seed.py'])