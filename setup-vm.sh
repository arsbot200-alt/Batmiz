#!/bin/bash

# Exit on any error
set -e

echo "======================================"
echo " Setting up Telegram Video Bot on VM  "
echo "======================================"

echo "[1/4] Installing dependencies (Node.js, FFmpeg, Git)..."
sudo dnf update -y
sudo dnf install -y gcc-c++ make
# Install Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Install FFmpeg (requires RPM Fusion on CentOS/RHEL)
sudo dnf install -y epel-release
sudo dnf install -y --nogpgcheck https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-$(rpm -E %rhel).noarch.rpm
sudo dnf install -y ffmpeg

echo "[2/4] Cloning repository..."
if [ -d "Batmiz" ]; then
  echo "Directory Batmiz already exists, pulling latest..."
  cd Batmiz
  git pull
else
  git clone https://github.com/arsbot200-alt/Batmiz.git
  cd Batmiz
fi

echo "[3/4] Installing NPM packages..."
npm install

echo "[4/4] Building the application..."
npm run build

echo "======================================"
echo " Setup Complete!                      "
echo "======================================"
echo "To start the bot in the background, run:"
echo "  cd Batmiz"
echo "  npm run start"
echo ""
echo "Note: You can use 'tmux' or 'screen' or 'pm2' to keep it running when you close the SSH session."
echo "  sudo npm install -g pm2"
echo "  pm2 start dist/server.cjs --name tg-video-bot"
echo "======================================"
