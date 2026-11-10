@echo off
echo ==============================================================
echo  Menjalankan Smart Complaint System - Pemda Lampung & UTI
echo ==============================================================
echo.
echo Membuka peramban di http://localhost:3000...
start http://localhost:3000
echo Menjalankan server aplikasi...
call npm.cmd run dev
pause
