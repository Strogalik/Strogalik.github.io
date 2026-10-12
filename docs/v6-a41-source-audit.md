# Source audit · TMS V6-A4.1

Текущий запрос пользователя — локальная композиционная правка A4.1. Более раннее требование intro отменено. Источник реализации — существующая рабочая папка A4; пакеты прошлых версий не накатывались.

До изменений сохранены 157 файлов и их SHA256. Git-метаданных нет. Семь существующих файлов изменены:

- `README.md`
- `playwright.v6.config.ts`
- `tests/review-v6.spec.ts`
- `components/review-v6/StoryExperience.tsx`
- `components/review-v6/story-content.ts`
- `components/review-v6/ReviewV6.tsx`
- `components/review-v6/content.module.css`

150 остальных файлов снимка совпадают по SHA256. В том числе StoryCopy, HeroStory, review.module.css, StoryScene, старые стили рисунков, app/, lib/, public/, package.json, lockfile и запуск preview.

В StoryExperience удалён только элемент вводного абзаца; в story-content удалено только поле section.intro. Секции products/scenes (все тексты, объяснения, ссылки и оговорки) совпадают с A4 побайтово. ReviewV6 меняет только метку версии. CSS меняет заголовочную компоновку и общий промежуток сетки; правила кнопок навигации не редактировались. Новых продуктовых утверждений, ассетов или зависимостей нет.

Добавлены два скрипта A4.1, отчёт, этот аудит, approval JSON и отдельная QA-папка. Старые A4-материалы оставлены историей. Patch содержит фактический diff-файлов с before/after SHA256, без QA, шрифтов, зависимостей, env и внутренних документов задания. Review содержит новые снимки/видео/журналы и отчёты. Полные результаты сравнения — qa/v6-a41/isolation-audit.json и verification.json.

awaiting_owner_approval; stageBStarted:false. Не выполнялись публичный deploy, реальные заявки, изменение секретов или этап B.
