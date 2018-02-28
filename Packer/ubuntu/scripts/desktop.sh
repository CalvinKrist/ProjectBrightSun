#!/bin/bash

if [[ ! "$DESKTOP" =~ ^(true|yes|on|1|TRUE|YES|ON])$ ]]; then
  exit
fi

echo "==> Installing ubunutu-desktop"
apt-get install -y ubuntu-desktop

SSH_USER=${SSH_USERNAME:-vagrant}
LIGHTDM_CONFIG=/etc/lightdm/lightdm.conf
GDM_CUSTOM_CONFIG=/etc/gdm/custom.conf

mkdir -p $(dirname ${GDM_CUSTOM_CONFIG})
echo "[daemon]" >> $GDM_CUSTOM_CONFIG
echo "# Enabling automatic login" >> $GDM_CUSTOM_CONFIG
echo "AutomaticLoginEnable=True" >> $GDM_CUSTOM_CONFIG
echo "AutomaticLoginEnable=${USERNAME}" >> $GDM_CUSTOM_CONFIG

echo "==> Configuring lightdm autologin"
echo "[SeatDefaults]" >> $LIGHTDM_CONFIG
echo "autologin-user=${SSH_USERNAME}" >> $LIGHTDM_CONFIG
echo "autologin-user-timeout=0" >> $LIGHTDM_CONFIG

echo "==> Disabling screen blanking"
cat << EOF > /etc/xdg/autostart/nodpms.desktop
[Desktop Entry]
Type=Application
Exec=xset -dpms s off s noblank s 0 0 s noexpose
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name[en_US]=nodpms
Name=nodpms
Comment[en_US]=
Comment=
EOF
