# B4 — сохранение принятого дизайна

Снимок текущего проекта сделан до правок:312 файлов с SHA256; старые baselines не перезаписаны. workspace_guard: protected_hashes_match, защищённые блоки Header/Hero/FinalCTA/PageHero и strict files совпадают.

180/180 свежих сравнений пиксельно идентичны:12 Hero (включая header),12 cases,12 cooperation и144 состояний шести тем (closed/open ×12размеров). Границы защищённых секций обрезаны одинаково, масок нет. Footer/FAQ/calculator намеренно изменены и не включены в protected PASS. Все пары доступны в галерее.

B1Sections.tsx/b1.module.css, HeroStory, шесть тем, кнопки/hover, local fonts, logo, token palette, продуктовые/кейсовые/юридические данные, вычислительные функции и defaults не изменены. Только дополнительные reflow-правила на публичном wrapper работают при нехватке места: wrapping B1-текста, shrink пустого badge, доступный skip-link и перенос desktop nav. Normal desktop/mobile подтверждены before/after.

Исходный A4.8 lock проверен без пересоздания: baselineIntegrityFailures пусто. Девять старых raw violations от B1 story и B3 удаления demo остаются такими же, как в B3; это не новый B4 PASS исходного A4.8. B4-защита опирается также на отдельный актуальный workspace guard и свежие пиксели.
