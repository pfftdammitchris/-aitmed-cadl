import AiTmedError from '../../common/AiTmedError'

import * as AccountUtilsTypes from './utilsTypes'

export const decodeUID: AccountUtilsTypes.DecodeUID = (uid) => {
  const lastIOfPlus = uid.lastIndexOf('+')
  if (lastIOfPlus < 0) {
    throw new AiTmedError({ name: 'UID_INVALID' })
  }
  return {
    userId: uid.slice(0, lastIOfPlus),
    phone_number: uid.slice(lastIOfPlus),
  }
}
