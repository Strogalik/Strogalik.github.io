# Source audit · V6-A4.2

162 файла в безопасном снимке до записи; все 12 reference afterSha256 A4.1 совпали. Git-метаданных нет. Семь существующих файлов изменены:

- `README.md`
- `playwright.v6.config.ts`
- `tests/review-v6.spec.ts`
- `components/review-v6/StoryExperience.tsx`
- `components/review-v6/story-content.ts`
- `components/review-v6/ReviewV6.tsx`
- `components/review-v6/content.module.css`

155 остальных файлов снимка совпадают по SHA256. StoryCopy, HeroStory, review.module.css, StoryScene, app/, lib/, public/, backend, demo, кейсы, контакты, package/lock, AGENTS и локальный launcher сохранены. Новых зависимостей/шрифтов/ассетов нет.

Три технических изменения: интерполяция общего gap, возврат скрываемого tab-focus с защитой другого focus destination, метка A4.2. Редакционно изменены только heading/body/explanation шести тем. Остальные поля, ссылки и порядок проверены на равенство с baseline. Применены все шесть candidate без смысловых дополнений. Source_refs сверены с актуальным story-content A4.1 и content/cases.public.json. Рабочие cases.public/site-copy совпали по хешам с предоставленными источниками. Таблица старого/нового текста и основания находятся в design-review.

В клиентских JS проверены шесть явных внутренних маркеров; совпадений нет. Это адресная проверка, не универсальная гарантия отсутствия любых секретов. Папка handoff находится вне приложения/public и не входит в выдачу. Маркеры редакционной проверки присутствуют только в локальном отчёте, а не в runtime data.

Новые файлы: capture/probe/verify A4.2, три документа и отдельная QA-папка. Старые итерации оставлены историей. Review содержит свежие доказательства; patch — 13 фактически изменённых/новых файлов с before/after SHA256. Шрифты, env, зависимости, сборка и внутренний пакет исключены.

awaiting_owner_approval; stageBStarted:false. Тексты и новый переход предлагаются для оценки владельцем. Публичного deploy/реальных отправок нет.
