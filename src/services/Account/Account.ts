import store from '../../common/store'

import Note from '../Note'

import * as AccountTypes from './types'

import * as accountUtils from './utils'

/**
 * @param phone_number: string
 * @returns Promise<string>
 */
export const requestVerificationCode: AccountTypes.RequestVerificationCode = async (
  phone_number,
) => {
  const response = await store.level2SDK.Account.requestVerificationCode({
    phone_number,
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return response && response.data && response.data.verification_code
}

/**
 * @param phone_number: string
 * @param password: string
 * @param verification_code: string
 */
export const create: AccountTypes.Create = async (
  phone_number,
  password,
  verification_code,
  name,
) => {
  // Create User
  await store.level2SDK.Account.createUser({
    phone_number,
    password,
    verification_code,
    userInfo: { name },
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  // Create Root Edge
  await accountUtils.createRootEdge()
}

/**
 *
 * @param phone_number: string
 * @param verification_code: string
 * @param password: string
 */
export const login: AccountTypes.Login = async (
  phone_number,
  password,
  verification_code,
) => {
  await loginByVerificationCode(phone_number, verification_code)
  const user = await loginByPassword(password)
  return user
}

/**
 * This method is only able to be used after login new device (loginByVerificationCode)
 * @param password: string
 */
export const loginByPassword: AccountTypes.LoginByPassword = async (
  password,
) => {
  await store.level2SDK.Account.login({ password })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  const user = await retrieve()
  return user
}

/**
 * @param phone_number: string
 * @param verification_code: string
 */
export const loginByVerificationCode: AccountTypes.LoginByVerificationCode = async (
  phone_number,
  verification_code,
) => {
  await store.level2SDK.Account.loginNewDevice({
    phone_number,
    verification_code,
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
}

/**
 * @returns Status
 * Status.code:
 *  0 - LOGGED_IN
 *  1 - LOGGED_OUT
 */
export const logout: AccountTypes.Logout = async (clean = false) => {
  if (clean) {
    store.level2SDK.Account.logoutClean()
  } else {
    const status = await getStatus()
    if (status.code === 1) return status
    store.level2SDK.Account.logout()
  }
  const latestStatus = await getStatus()
  return latestStatus
}

/**
 * Todo:
 *    waiting for backend to support verificating the verification code
 * @param phone_number: string
 * @param new_phone_number: string
 * @param verification_code: string
 * @returns Promise<User>
 */
/*
export const updatePhoneNumber = async (
  phone_number: string,
  new_phone_number: string,
  verification_code: string,
): Promise<AccountTypes.User> => {
  console.log(
    'Account->updatePhoneNumber',
    phone_number,
    new_phone_number,
    verification_code,
  )

  return mockUser
}
*/

/**
 * @param param
 * @param param.old_password: string
 * @param param.new_password: string
 */
export const updatePassword: AccountTypes.UpdatePassword = async (
  old_password,
  new_password,
) => {
  await store.level2SDK.Account.changePasswordWithOldPassword({
    oldPassword: old_password,
    newPassword: new_password,
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
}

/**
 * @param param
 * @param param.phone_number: string
 * @param param.verification_code: string
 * @param param.new_password: string
 */
export const updatePasswordByVerificationCode: AccountTypes.UpdatePasswordByVerificationCode = async ({
  phone_number,
  verification_code,
  new_password,
}) => {
  await store.level2SDK.Account.changePasswordWithVerificationCode({
    phone_number,
    verification_code,
    password: new_password,
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
}

/**
 * @param profile: AccountTypes.Profile
 *
 * @param profile.first_name: string
 * @param profile.middle_name?: string
 * @param profile.last_name: string
 *
 * @param profile.gender: 'MALE' | 'FEMALE' | 'PNS'
 * @param profile.birthday: number
 * @param profile.languages?: string[]
 *
 * @param profile.profile_photo?: string
 *
 * @returns Promise<User>
 */
export const updateProfile: AccountTypes.UpdateProfile = async (profile) => {
  const root = await accountUtils.retrieveRootEdge()
  // Clean Profile
  const notes = await Note.list(root.eid, { dataType: 'profile' })
  for (const noteId of notes.ids) {
    await accountUtils.removeProfile(noteId, notes.mapper[noteId])
  }
  // Create Profile
  await accountUtils.createProfile(root.eid, profile)
  const user = await retrieve()
  return user
}

/**
 * @returns Promise<User>
 */
export const retrieve: AccountTypes.Retrieve = async () => {
  const root = await accountUtils.retrieveRootEdge()
  const profile = await accountUtils.retrieveProfile(root.eid)
  const user = await accountUtils.generateUser(
    root,
    profile ? profile.profile : null,
  )
  return user
}

/**
 * @returns Promise<User>
 */
export const remove: AccountTypes.Remove = async () => {
  const user = await retrieve()

  // Clean root edge
  const edge = await accountUtils.retrieveRootEdge()
  const notes = await Note.list(edge.eid)
  // Remove all note under root edge
  for (const noteId of notes.ids) {
    await store.level2SDK.documentServices
      .deleteDocument([noteId])
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
  }
  await store.level2SDK.edgeServices
    .deleteEdge([edge.eid])
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  await store.level2SDK.vertexServices.deleteVertex([edge.bvid])
  await logout(true)
  return user
}

/**
 * @returns Status
 * Status.code:
 *  0 - LOGGED_IN
 *  1 - LOGGED_OUT
 *  2 - NEW_DEVICE
 * Status.userId: string
 * Status.code: string
 */
export const getStatus: AccountTypes.GetStatus = async () => {
  const status = await store.level2SDK.Account.getStatus()
  try {
    const uid = localStorage.getItem('uid')
    if (uid === null) throw new Error('uid is null')
    const utf8Uid = store.level2SDK.utilServices.base64ToUTF8(uid)
    const { userId, phone_number } = accountUtils.decodeUID(utf8Uid)
    return { ...status, userId, phone_number }
  } catch (error) {
    return { ...status, userId: '', phone_number: '' }
  }
}

/**
 * 
 * @param password string
 * @returns boolean
 */
export const verifyUserPassword = (password: string): boolean => {
  try {
    const [isPasswordValid,] = store.level2SDK.Account.verifyUserPassword({ password })
    if (isPasswordValid) return true
  } catch (error) {
    if (error.name = 'PASSWORD_INVALID') {
      return false
    }
  }
  return false
}