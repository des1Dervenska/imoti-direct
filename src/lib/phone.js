/**
 * Български мобилен: национална форма с водеща 0 пред 8/9 (10 цифри) → E.164 +359…
 * Ползва се само за нормализация на телефона от контактната форма в имейла.
 */

/** @param {unknown} input */
function digitsOnly(input) {
  if (input == null) return '';
  return String(input).replace(/\D/g, '');
}

/**
 * Нормализира български мобилен или вече +359… към E.164.
 * @param {unknown} input
 * @returns {string} напр. "+359887803064", или "" ако не е разпознат BG мобилен
 */
export function normalizeBgPhoneToE164(input) {
  const d = digitsOnly(input);
  if (!d) return '';
  if (d.length === 12 && d.startsWith('359') && /^359[89]\d{8}$/.test(d)) {
    return `+${d}`;
  }
  if (d.length === 10 && /^0[89]\d{8}$/.test(d)) {
    return `+359${d.slice(1)}`;
  }
  if (d.length === 9 && /^[89]\d{8}$/.test(d)) {
    return `+359${d}`;
  }
  return '';
}

/**
 * Pretty display for a normalized BG mobile (+359 + 9 digits).
 * @param {unknown} e164OrDigits
 * @returns {string}
 */
export function formatBgMobileDisplay(e164OrDigits) {
  const d = digitsOnly(e164OrDigits);
  if (!d) return '';
  const national = d.startsWith('359') ? d.slice(3) : d;
  if (national.length !== 9 || (national[0] !== '8' && national[0] !== '9')) {
    return d.startsWith('359') ? `+359 ${d.slice(3)}`.trim() : d ? `+${d}` : '';
  }
  return `+359 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
}

/**
 * For UI/email: show +359 form when input is a BG mobile, otherwise trimmed raw.
 * @param {unknown} input
 * @returns {string}
 */
export function displayBgPhoneOrRaw(input) {
  if (input == null) return '';
  const trimmed = String(input).trim();
  if (!trimmed) return '';
  const e164 = normalizeBgPhoneToE164(trimmed);
  if (e164) return formatBgMobileDisplay(e164);
  return trimmed;
}
