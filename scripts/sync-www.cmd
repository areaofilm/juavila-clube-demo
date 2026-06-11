@echo off
setlocal
set ROOT=%~dp0..
set WWW=%ROOT%\www
set ASSETS=%WWW%\assets

if not exist "%WWW%" mkdir "%WWW%"
if not exist "%ASSETS%" mkdir "%ASSETS%"

copy /Y "%ROOT%\index.html" "%WWW%\" >nul
copy /Y "%ROOT%\admin.html" "%WWW%\" >nul
copy /Y "%ROOT%\styles.css" "%WWW%\" >nul
copy /Y "%ROOT%\data.js" "%WWW%\" >nul
copy /Y "%ROOT%\app.js" "%WWW%\" >nul
copy /Y "%ROOT%\admin.js" "%WWW%\" >nul
copy /Y "%ROOT%\manifest.json" "%WWW%\" >nul
copy /Y "%ROOT%\service-worker.js" "%WWW%\" >nul
copy /Y "%ROOT%\privacy.html" "%WWW%\" >nul
copy /Y "%ROOT%\terms.html" "%WWW%\" >nul

copy /Y "%ROOT%\assets\ideia-de-app.png" "%ASSETS%\" >nul
copy /Y "%ROOT%\assets\icon-192.png" "%ASSETS%\" >nul
copy /Y "%ROOT%\assets\icon-512.png" "%ASSETS%\" >nul
copy /Y "%ROOT%\assets\maskable-512.png" "%ASSETS%\" >nul

echo www sincronizado.
