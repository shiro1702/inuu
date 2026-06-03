import { describe, expect, it } from 'vitest'
import {
  inferContentIntakeChannel,
  intakeFromPayload,
  resolveContentIntakeLabel,
} from '../server/utils/contentSubmissionIntake'

describe('contentSubmissionIntake', () => {
  it('maps source kinds to manager-facing labels', () => {
    expect(resolveContentIntakeLabel({ sourceKind: 'web_cron', sourceUrl: 'https://kassir.ru/events' })).toBe(
      'Парсинг сайта',
    )
    expect(resolveContentIntakeLabel({ sourceKind: 'manual_editor' })).toBe('Ручной ввод')
    expect(resolveContentIntakeLabel({ sourceKind: 'bot_submit' })).toBe('Прямо в бота')
    expect(
      resolveContentIntakeLabel({
        sourceKind: 'telegram_parse',
        intake: 'telegram_group',
      }),
    ).toBe('Группа в Telegram')
  })

  it('treats t.me web-cron URLs as telegram channel parse', () => {
    expect(
      inferContentIntakeChannel({
        sourceKind: 'web_cron',
        sourceUrl: 'https://t.me/s/standuuup2u',
      }),
    ).toBe('telegram_channel')
  })

  it('reads intake from payload', () => {
    expect(
      intakeFromPayload({
        source: { kind: 'telegram_parse', url: null, external_id: '1:2', intake: 'telegram_group' },
      }),
    ).toBe('telegram_group')
  })
})
