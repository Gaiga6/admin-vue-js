/**
 * 判断是否是外部链接
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断是否是有效的URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 判断是否是有效的邮箱
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 判断是否是有效的密码（至少包含大小写字母和数字，长度8-16位）
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
  return reg.test(password)
}

/**
 * 判断是否是有效的手机号（中国大陆手机号）
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
} 