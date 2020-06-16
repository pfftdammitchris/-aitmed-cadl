import { AccountTypes } from '../index'

import _mockStore from '../../../common/store/mock'

const mockUser: AccountTypes.User = {
  id: 'id',
  name: 'name',
  userId: 'userId',
  phone_number: 'phone_number',
  profile: {
    roles: 0,

    first_name: 'first_name',
    middle_name: 'middle_name',
    last_name: 'last_name',

    //@ts-ignore
    profile_photo: 'profile_photo',

    gender: 'MALE',
    birthday: 1234567890123,
    languages: ['en-US'],
  },
}

const mockData = {
  phone_number: '+1 1234567890',
  password: '1234567890',
  verification_code: '555555',
  new_password: '0987654321',
}

const mockStore = { ..._mockStore }

const mockNotebook = {
  create: jest.fn(async () => ({ id: 'id' })),
  listEdges: jest.fn(async () => {
    return [{ eid: 'eid' }]
  }),
}

const mockNote = {
  create: jest.fn(async () => ({ id: 'id' })),
  updateNote: jest.fn(async () => {}),
  list: jest.fn(async () => {
    return {
      ids: ['id'],
      mapper: {
        id: {
          info: {
            title: 'profile',
            type: 1,
            content: JSON.stringify({ roles: 1 }),
          },
        },
      },
    }
  }),
}

const mockUtils = {
  createRootNotebook: jest.fn(async () => ({ id: 'id' })),
  retrieveRootEdge: jest.fn(async () => ({ id: 'id' })),
  createProfileNote: jest.fn(async () => ({ id: 'id' })),
  retrieveProfile: jest.fn(async () => ({ id: 'id' })),
  generateUser: jest.fn(async () => ({ id: 'id' })),
}

describe('Account', () => {
  beforeAll(() => {
    jest.resetModules()
    jest.mock('../../common/store', () => mockStore)
    jest.mock('../../Notebook', () => mockNotebook)
    jest.mock('../../Note', () => mockNote)
    jest.mock('../utils.ts', () => mockUtils)
  })

  it('should has requestVerificationCode to call store.level2SDK.Account.requestVerificationCode', () => {
    mockStore.level2SDK.Account.requestVerificationCode.mockClear()
    return import('../index').then(async ({ default: account }) => {
      await account.requestVerificationCode(mockData.phone_number)
      expect(
        mockStore.level2SDK.Account.requestVerificationCode.mock.calls.length,
      ).toBe(1)
    })
  })

  it('should has create to call store.level2SDK.Account.createUser', () => {
    mockStore.level2SDK.Account.createUser.mockClear()
    mockUtils.createRootNotebook.mockClear()
    mockUtils.createProfileNote.mockClear()
    return import('../index').then(async ({ default: account }) => {
      await account.create(
        mockData.phone_number,
        mockData.password,
        parseInt(mockData.verification_code),
        mockUser.name,
      )
      expect(mockStore.level2SDK.Account.createUser.mock.calls.length).toBe(1)
      expect(mockUtils.createRootNotebook.mock.calls.length).toBe(1)
      expect(mockUtils.createProfileNote.mock.calls.length).toBe(1)
    })
  })

  describe('should has login', () => {
    it('to call store.level2SDK.Account login, loginNewDevice', async () => {
      mockStore.level2SDK.Account.loginNewDevice.mockClear()
      mockStore.level2SDK.Account.login.mockClear()
      mockUtils.retrieveRootEdge.mockClear()
      mockUtils.retrieveProfile.mockClear()
      mockUtils.generateUser.mockClear()
      return import('../index').then(async ({ default: account }) => {
        await account.login(
          mockData.phone_number,
          mockData.password,
          mockData.verification_code,
        )
        expect(
          mockStore.level2SDK.Account.loginNewDevice.mock.calls.length,
        ).toBe(1)
        expect(mockStore.level2SDK.Account.login.mock.calls.length).toBe(1)
        expect(mockUtils.retrieveRootEdge.mock.calls.length).toBe(1)
        expect(mockUtils.retrieveProfile.mock.calls.length).toBe(1)
        expect(mockUtils.generateUser.mock.calls.length).toBe(1)
      })
    })
    // by password
    it('by password to call store.level2SDK.Account.login', async () => {
      mockStore.level2SDK.Account.login.mockClear()
      mockUtils.retrieveRootEdge.mockClear()
      mockUtils.retrieveProfile.mockClear()
      mockUtils.generateUser.mockClear()
      return import('../index').then(async ({ default: account }) => {
        await account.loginByPassword(mockData.password)
        expect(mockStore.level2SDK.Account.login.mock.calls.length).toBe(1)
        expect(mockUtils.retrieveRootEdge.mock.calls.length).toBe(1)
        expect(mockUtils.retrieveProfile.mock.calls.length).toBe(1)
        expect(mockUtils.generateUser.mock.calls.length).toBe(1)
      })
    })
    // by verification code
    it('by verification code to call store.level2SDK.Account.loginNewDevice', async () => {
      mockStore.level2SDK.Account.loginNewDevice.mockClear()
      return import('../index').then(async ({ default: account }) => {
        await account.loginByVerificationCode(
          mockData.phone_number,
          mockData.verification_code,
        )
        expect(
          mockStore.level2SDK.Account.loginNewDevice.mock.calls.length,
        ).toBe(1)
      })
    })
  })

  describe('should has logout', () => {
    mockStore.level2SDK.Account.logout.mockClear()
    mockStore.level2SDK.Account.logoutClean.mockClear()
    it('call store.level2SDK.Account.logout', () => {
      return import('../index').then(({ default: account }) => {
        account.logout()
        expect(mockStore.level2SDK.Account.logout.mock.calls.length).toBe(1)
        expect(mockStore.level2SDK.Account.logoutClean.mock.calls.length).toBe(
          0,
        )
      })
    })
    it('call store.level2SDK.Account.logoutClean', () => {
      mockStore.level2SDK.Account.logout.mockClear()
      mockStore.level2SDK.Account.logoutClean.mockClear()
      return import('../index').then(({ default: account }) => {
        account.logout(true)
        expect(mockStore.level2SDK.Account.logout.mock.calls.length).toBe(0)
        expect(mockStore.level2SDK.Account.logoutClean.mock.calls.length).toBe(
          1,
        )
      })
    })
  })

  it('should has update', async () => {
    mockUtils.retrieveProfile.mockClear()
    mockNote.updateNote.mockClear()
    mockUtils.retrieveRootEdge.mockClear()
    mockUtils.generateUser.mockClear()
    return import('../index').then(async ({ default: account }) => {
      const fields = {
        first_name: mockUser.profile.first_name,
        middle_name: mockUser.profile.middle_name,
        last_name: mockUser.profile.last_name,

        profile_photo: mockUser.profile.profile_photo,

        gender: mockUser.profile.gender,
        birthday: mockUser.profile.birthday,
        languages: mockUser.profile.languages,
      }

      //@ts-ignore
      await account.update(fields)
      expect(mockUtils.retrieveProfile.mock.calls.length).toBe(2)
      expect(mockNote.updateNote.mock.calls.length).toBe(1)
      expect(mockUtils.retrieveRootEdge.mock.calls.length).toBe(1)
      expect(mockUtils.generateUser.mock.calls.length).toBe(1)
    })
  })

  // Todo: updatePhoneNumber
  // it('should has updatePhoneNumber', () => {
  //   return import('../index').then(async ({ default: account }) => {
  //     await account.updatePhoneNumber(
  //       mockData.phone_number,
  //       mockData.phone_number,
  //       mockData.verification_code,
  //     )
  //     expect(log).toHaveBeenCalledWith(
  //       'Account->updatePhoneNumber',
  //       mockData.phone_number,
  //       mockData.phone_number,
  //       mockData.verification_code,
  //     )
  //   })
  // })

  it('should has updatePassword', () => {
    mockStore.level2SDK.Account.changePasswordWithOldPassword.mockClear()
    return import('../index').then(async ({ default: account }) => {
      await account.updatePassword('1234567890', '0987654321')
      expect(
        mockStore.level2SDK.Account.changePasswordWithOldPassword.mock.calls
          .length,
      ).toBe(1)
    })
  })

  it('should has retrieve', () => {
    mockUtils.retrieveRootEdge.mockClear()
    mockUtils.retrieveProfile.mockClear()
    mockUtils.generateUser.mockClear()
    return import('../index').then(async ({ default: account }) => {
      await account.retrieve()
      expect(mockUtils.retrieveRootEdge.mock.calls.length).toBe(1)
      expect(mockUtils.retrieveProfile.mock.calls.length).toBe(1)
      expect(mockUtils.generateUser.mock.calls.length).toBe(1)
    })
  })
})
