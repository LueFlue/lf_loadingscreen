fx_version 'cerulean'
game 'gta5'

author 'LF Scripts - https://discord.gg/f595VxygMt'
description 'Loadingscreen af LF Scripts'
version '1.0.0'

loadscreen 'html/index.html'

files {
    'html/config.js',
    'html/index.html',
    'html/css/*.css',
    'html/js/*.js',
    'html/assets/*.*'
}

client_scripts {
    'client/client.lua'
}

loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'