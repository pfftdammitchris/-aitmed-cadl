export default {
  random: function () {
    const rand = Math.random()
    return rand
  },
  add: function ({ num1, num2 }): number {
    return num1 + num2
  },
  greater: function ({ num1, num2 }): boolean {
    return num1 > num2
  }
}
