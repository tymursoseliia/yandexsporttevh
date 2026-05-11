@echo off
chcp 65001 >nul
echo Возвращаем верную ссылку на репозиторий...
git remote set-url origin https://github.com/gorbacenkovitalij6-prog/yandex-maps-bta-torg.git

echo Удаление старых данных авторизации (gennadiyyasnov-maker)...
git credential-manager reject https://github.com

echo ---------------------------------------------------
echo Сейчас появится официальное окно входа от GitHub.
echo Пожалуйста, зайдите под своим профилем: gorbacenkovitalij6-prog
echo ---------------------------------------------------
git push origin main

echo.
echo Если загрузка прошла успешно, вы можете закрыть это окно.
pause
