import _ from 'lodash'

export default {
  inRange({ number, start, end }): boolean {
    if (number == start || number == end) {
      return true
    }
    return _.inRange(number, start, end)
  },
  multiply({ number, multiple }): number {
    if (number && multiple) {
      return number * multiple
    }
    return 0
  },
  OctToBin({ number }) {
    if (number) {
      return number.toString(2).toString()
    }
    return 0
  },
  getAuthority({ binary }) {
    class Authority {
      create: boolean
      edit: boolean
      review: boolean
    }
    let authority: string[] = []
    let medicalFacilityInfo = new Authority()
    // let authorityList = new Authority()
    if (binary) {
      authority = binary.split("")
    }
    if (authority[0] === "1")
      if (authority[1] === "1")
        // authorityList.medicalFacilityInfo.create = true
        return authorityList
  }
}
