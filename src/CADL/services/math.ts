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
  },

  lessthanSize: function({object,key}): boolean {
　　if (parseFloat(object).toString() !== "NaN") { 
     let maxSize: number = Math.floor(key*Math.pow(1024,2))
        return  object > maxSize ? false : true        
  　　} 
    return false
  }
}
