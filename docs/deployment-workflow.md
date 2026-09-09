# ALGA Sport Shop: GitHub и Vercel

## Подключение

- Репозиторий: [Bissult4n/algasport](https://github.com/Bissult4n/algasport).
- Vercel: существующий [alga-sport-shops](https://vercel.com/bissultan-s-projects/alga-sport-shops).
- Основной адрес: [alga-sport-shops.vercel.app](https://alga-sport-shops.vercel.app).
- Интеграция: Vercel GitHub App, доступ подтверждён владельцем.
- Production Branch: `main`; автоматическое создание deployments включено.
- Отдельные ветки получают preview в этом же проекте; новый проект для каждой ветки не нужен.

## Обычная Работа

1. Создайте ветку от актуального `main`, например `codex/update-catalog`.
2. Внесите изменения, выполните нужные проверки и создайте коммит.
3. Отправьте ветку в GitHub: `git push -u origin codex/update-catalog`.
4. Дождитесь статуса Ready в Vercel. Откройте preview из списка Deployments или GitHub commit checks.
5. После проверки объедините изменения с `main`. Push или merge в `main` запускает production build и после успешной сборки обновляет основной адрес.

Прямой push в `main` тоже публикует изменения. Preview-ветка не переключает основной адрес. Для безопасной отмены изменения создайте новый revert-коммит, не переписывайте общую историю через force push.

## Сборка

| Настройка | Значение |
| --- | --- |
| Framework | Other |
| Root | Корень репозитория |
| Node.js | 24.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `out` |

Команды и output заданы в `vercel.json`, Node.js закреплён в `package.json` и настройках проекта. Публикуется статический export Next.js. Backend, serverless functions, adapters, rewrites и GitHub Actions для deployment не добавлялись. Авторизованный Vercel GitHub App запускает сборки; личные CLI-токены не передаются через Git.

## Пока Это Тестовый Магазин

Название окружения production означает основной адрес, а не готовность принимать коммерческие заказы.

- По умолчанию в обоих окружениях: `noindex, nofollow`.
- WhatsApp пустой; формирование, просмотр и копирование заказа работают, переход в мессенджер отключён.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` подключать только после подтверждения постоянного номера.
- `NEXT_PUBLIC_ALLOW_INDEXING=true` задавать только после отдельного решения о запуске.
- На момент подключения env-переменных проекта нет; применяются безопасные значения из `lib/shop-config.ts`.
- Цены, владельцы, наличие, доставка и точная модель жгута остаются неподтверждёнными, как и до подключения.

Любое изменение build-time env требует новой публикации. `noindex` не ограничивает доступ к публичной ссылке.

## Проверка Автообновления

В Vercel Deployments сверяйте GitHub commit SHA, ветку, окружение и статус Ready. Для `main` должен быть Production, для остальных веток Preview. GitHub commit checks также содержат результат Vercel и ссылку на deployment. Убедитесь, что основной адрес показывает нужную версию, а не исторический preview URL.

Если сборки не запускаются, проверьте доступ Vercel GitHub App к `algasport`, связь в Project Settings > Git и Production Branch `main`. При ошибке сборки смотрите Build Logs конкретного deployment. Email автора коммита должен быть связан с GitHub-аккаунтом, имеющим доступ к Vercel. Не создавайте дубликат проекта и не помещайте токены в исходники.
