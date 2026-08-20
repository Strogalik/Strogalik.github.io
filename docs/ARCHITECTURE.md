# Frontend architecture

## Runtime

React + TypeScript + Vite.

## Routing

React Router. Каждый домен имеет URL. Никаких гигантских switch-case routers.

## Server state

TanStack Query.

UI -> query hooks -> API adapter -> REST/OpenAPI backend.

В текущем reference build API adapter возвращает coherent mock dataset. Это временный backend substitute, а не данные внутри компонентов.

## Recommended next refactor when backend starts

```
src/api/
  generated/
  http/
  queries/
```

Generate DTO from backend OpenAPI. Страницы должны продолжать работать через hooks и не импортировать backend DTO напрямую, если они требуют presentation mapping.

## Security

Frontend permissions — UX only. Backend авторизует каждую операцию. Не хранить private keys, API secrets и operator tokens в browser environment.
