export default {
  phoneNumber({ phoneNumber, countryCode, toastMessage, style }) {
    const countryCodeAndPhoneNumber = countryCode + ' ' + phoneNumber
    if (countryCodeAndPhoneNumber.match(/^[+][0-9]+\s\d{10}$/)) {
      return true
    } else {
      return {
        toastMessage,
        style,
      }
    }
  },
}
