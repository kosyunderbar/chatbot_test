import { createI18n } from 'vue-i18n'
import ko from './ko'
import en from './en'

const i18n = createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'ko',
  messages: {
    ko,
    en,
  },
})

export default i18n
