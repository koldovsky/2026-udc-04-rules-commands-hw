# Запуск команди на реальній задачі (Task C)

Task C вимагає не лише написати команди, а й **прогнати хоча б одну на реальній
задачі**. Тут — протокол такого прогону.

**Команда:** `/analyze-error` ([`.cursor/commands/analyze-error.md`](../.cursor/commands/analyze-error.md),
дзеркало для Claude Code — [`.claude/commands/analyze-error.md`](../.claude/commands/analyze-error.md)).
**Інструмент:** Claude Code (Opus 5). **Ввід у `$ARGUMENTS`:** текст помилки, скопійований з термінала.

## Задача

У `app/src/selectors.ts` з'явився селектор `topTaskTitle`, який не компілюється:

```ts
export function topTaskTitle(state: AppState): string {
  return capitalize(visibleTasks(state)[0].title);
}
```

Реальний вивід (він і був аргументом команди):

```
$ cd app && npm run typecheck
src/selectors.ts(28,10): error TS2304: Cannot find name 'capitalize'.
src/selectors.ts(28,21): error TS2532: Object is possibly 'undefined'.
```

Помилка вибрана невипадково: один рядок б'є одразу у два пункти зі списку
«usual suspects» самої команди — вигаданий хелпер (`custom-lib.mdc`) і
незахищений індексний доступ під `noUncheckedIndexedAccess` (`conventions.mdc`).

## Що команда змусила зробити

| Крок команди | Що фактично сталося |
|---|---|
| 1. Читати файл, не вгадувати | відкрито `selectors.ts:27-29` до будь-якої правки |
| 2. Відтворити й **цитувати** вивід | `npm run typecheck` запущено, вивід вставлений дослівно |
| 3. Одне речення про корінь | «`capitalize` не існує ніде в репо; `visibleTasks(state)[0]` має тип `Task \| undefined`» |
| 4. Спершу «usual suspects» | збіг із пунктами 1 і 4 списку — гіпотези не вигадувалися |
| 5. Заборонені «фікси» | жодного `any` / `!` / `@ts-ignore`; `store.ts`, `types.ts`, `package.json` не торкалися |
| 6. Верифікація | `npm test` → **22 passed**, `npm run typecheck` → чисто |

Фікс — по причині, а не по симптому:

```ts
// Undefined when nothing is visible under the current filter — callers decide
// what to show instead, so the selector stays a pure read helper.
export function topTaskTitle(state: AppState): string | undefined {
  return visibleTasks(state)[0]?.title;
}
```

Плюс два colocated `it()` у `app/src/selectors.test.ts` за `testing.mdc`
(власний `describe`, lowercase-речення без «should»).

## Що тут показове

- **`capitalize` не був доданий у `text.ts`.** Спокуса «полагодити» помилку
  `TS2304`, дописавши хелпер, — але форматування не є роботою селектора
  (`state-access.mdc`: селектори — це словник читання). Команда вивела на те, що
  зайвий тут сам виклик, а не відсутня функція.
- **Тип став `string | undefined`, а не `!`.** Найшвидший спосіб прибрати
  `TS2532` — non-null `!`; він прямо в списку заборонених. Порожній список —
  реальний стан, і тепер він у сигнатурі.

## Відтворення

```bash
git apply docs/ab-evidence/taskc-analyze-error.diff
cd app && npm test && npm run typecheck   # 22 passed, tsc чистий
cd .. && git checkout -- app/
```

Зміна в репо **не залишена**: це перевірка команди, а не фіча. Робоче дерево
чисте, `npm test` = 20 passed, як до прогону.

Дві інші команди (`/add-action`, `/refactor`) написані за тим самим шаблоном і
посилаються на ті самі правила; окремо на реальній задачі не прогонялися.
