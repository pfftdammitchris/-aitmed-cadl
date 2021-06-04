export default {
  phoneNumber({ phoneNumber, countryCode, toastMessage, style }) {
    let validPhoneNumber
    if (phoneNumber.includes('-')) {
      validPhoneNumber = phoneNumber.replace(/-/g, '')
    } else {
      validPhoneNumber = phoneNumber
    }
    const countryCodeAndPhoneNumber = countryCode + ' ' + validPhoneNumber
    if (countryCodeAndPhoneNumber.match(/^[+][0-9]+\s\d{10}$/)) {
      return true
    } else {
      return {
        toast: { message: toastMessage, style },
      }
    }
  },
  userName(userName: string) {
    let len
    len = userName.length
    if (len > 5 && len < 17) {
      return true
    } else {
      return false
    }
  },
}

