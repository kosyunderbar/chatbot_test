import { createI18n } from 'vue-i18n'
import ko from './ko'
import en from './en'
import ja from './ja'
import zh from './zh'

const i18n = createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'ko',
  messages: {
    ko,
    en,
    ja,
    zh,
  },
})

export default i18n
