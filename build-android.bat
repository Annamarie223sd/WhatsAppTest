@echo off
echo.
echo ========================================
echo 🚀 WhatsApp Chat Generator - Android 构建
echo ========================================
echo.

echo 📦 检查环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Java，请先安装 JDK
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

echo 📦 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo 🔨 构建 Web 应用...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Web 构建失败
    pause
    exit /b 1
)

echo ⚡ 同步到 Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor 同步失败
    pause
    exit /b 1
)

echo 📱 构建 Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Android 构建失败
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ 构建完成！
echo 📍 APK 位置: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🎉 现在可以安装到 Android 设备测试了！
echo.

pause
