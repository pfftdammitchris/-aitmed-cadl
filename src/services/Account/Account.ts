import store, { Status } from '../../common/store'
import { UnableToMakeAnotherRequest } from '../../CADL/errors'

import Note from '../Note'

import * as AccountTypes from './types'

import * as accountUtils from './utils'
import { retrieveVertex } from '../../common/retrieve'

/**
 * @param phone_number: string
 * @throws {UnableToMakeAnotherRequest} When the same request is made within 60secs
 * @returns Promise<string>
 */
export const requestVerificationCode: AccountTypes.RequestVerificationCode = async (
  phone_number
) => {
  if (store.noodlInstance) {
    if (
      store.noodlInstance.verificationRequest.timer > 0 &&
      store.noodlInstance.verificationRequest.phoneNumber === phone_number
    ) {
      throw new UnableToMakeAnotherRequest(
        'User must wait 60 sec to make another verification code request.'
      )
    } else {
      store.noodlInstance.verificationRequest.timer = 60
      store.noodlInstance.verificationRequest.phoneNumber = phone_number
      const interval = setInterval(() => {
        if (store.noodlInstance.verificationRequest.timer === 0) {
          clearInterval(interval)
        } else {
          store.noodlInstance.verificationRequest.timer--
        }
      }, 1000)
    }
  }
  const response = await store.level2SDK.Account.requestVerificationCode({
    phone_number,
  })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)
  return response && response.data && response.data?.verification_code
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
  userName
) => {
  const { code: statusCode, ...rest } = await getStatus()
  let userVertex
  if (statusCode === 3) {
    const { data } = await store.level2SDK.Account.createInvitedUser({
      id: rest?.data.user_id,
      phone_number,
      password,
      userInfo: { userName, phoneNumber: phone_number },
    })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
    userVertex = data
  } else {
    // Create User
    const { data } = await store.level2SDK.Account.createUser({
      phone_number,
      password,
      verification_code,
      userInfo: { userName, phoneNumber: phone_number },
    })
      .then(store.responseCatcher)
      .catch(store.errorCatcher)
    userVertex = data
  }

  return userVertex
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
  verification_code
) => {
  const res = await loginByVerificationCode(phone_number, verification_code)
  if (res instanceof Status) {
    await store.level2SDK.Account.login()
    return res
  }
  const user = await loginByPassword(password)
  //TODO: edit when user profile is more standardized
  if (user.id) {
    const userVertex = await retrieveVertex(user.id)
    if (userVertex && userVertex.name && userVertex.name.username) {
      userVertex.name.userName = userVertex.name.username
      delete userVertex.name.username
    }
    return userVertex
  } else {
    return user
  }
}

/**
 * This method is only able to be used after login new device (loginByVerificationCode)
 * @param password: string
 */
export const loginByPassword: AccountTypes.LoginByPassword = async (
  password
) => {
  await store.level2SDK.Account.login({ password })
    .then(store.responseCatcher)
    .catch(store.errorCatcher)

  const {
    data: { user_id },
  } = await getStatus()
  let user
  if (user_id) {
    const userVertex = await retrieveVertex(user_id)
    if (userVertex && userVertex.name && userVertex.name.username) {
      userVertex.name.userName = userVertex.name.username
      delete userVertex.name.username
    }
    user = userVertex
  }
  return user
}

/**
 * @param phone_number: string
 * @param verification_code: string
 */
export const loginByVerificationCode: AccountTypes.LoginByVerificationCode = async (
  phone_number,
  verification_code
) => {
  return await store.level2SDK.Account.loginNewDevice({
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
    localStorage.removeItem('Global')
  } else {
    const status = await getStatus()
    if (status.code === 1) return status
    store.level2SDK.Account.logout()
    localStorage.removeItem('Global')
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
  new_password
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
    profile ? profile.profile : null
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
 *  3 = TEMP_ACCOUNT
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
    console.log(error)
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
    const [isPasswordValid] = store.level2SDK.Account.verifyUserPassword({
      password,
    })
    if (isPasswordValid) return true
  } catch (error) {
    if ((error.name = 'PASSWORD_INVALID')) {
      return false
    }
  }
  return false
}
