import { NotebookTypes } from '../index'
import _mockStore from '../../../common/store/mock'

const mockNotebook: NotebookTypes.Notebook = {
  id: 'id',
  owner_id: 'owner_id',
  info: {
    title: 'I am the title',
    description: 'I am a description',
    edit_mode: 7,
  },
  isEncrypt: false,

  created_at: 0,
  modified_at: 0,

  type: 10000,
}

const mockStore = {
  ..._mockStore,
}

describe('Notebook', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.mock('../../common/store', () => mockStore)
  })
  beforeEach(() => {})

  it('should has create', () => {
    mockStore.level2SDK.edgeServices.createEdge.mockClear()
    return import('../index').then(async ({ default: Notebook }) => {
      const notebook = Notebook
      await notebook.create({ title: mockNotebook.info.title })

      expect(
        mockStore.level2SDK.edgeServices.createEdge.mock.calls.length,
      ).toBe(1)
    })
  })

  it('should has remove', () => {
    mockStore.level2SDK.edgeServices.retrieveEdge.mockClear()
    mockStore.level2SDK.edgeServices.deleteEdge.mockClear()
    return import('../index').then(async ({ default: Notebook }) => {
      const notebook = Notebook
      await notebook.remove(mockNotebook.id)
      expect(
        mockStore.level2SDK.edgeServices.retrieveEdge.mock.calls.length,
      ).toBe(1)
      expect(
        mockStore.level2SDK.edgeServices.deleteEdge.mock.calls.length,
      ).toBe(1)
    })
  })

  it('should has update', () => {
    mockStore.level2SDK.edgeServices.retrieveEdge.mockClear()
    mockStore.level2SDK.edgeServices.updateEdge.mockClear()
    return import('../index').then(async ({ default: Notebook }) => {
      const notebook = Notebook
      const fields = {
        title: mockNotebook.info.title,
      }
      await notebook.update(mockNotebook.id, fields)
      expect(
        mockStore.level2SDK.edgeServices.retrieveEdge.mock.calls.length,
      ).toBe(2)
      expect(
        mockStore.level2SDK.edgeServices.updateEdge.mock.calls.length,
      ).toBe(1)
    })
  })

  it('should has retrieve', () => {
    mockStore.level2SDK.edgeServices.retrieveEdge.mockClear()
    return import('../index').then(async ({ default: Notebook }) => {
      const notebook = Notebook
      await notebook.retrieve(mockNotebook.id)
      expect(
        mockStore.level2SDK.edgeServices.retrieveEdge.mock.calls.length,
      ).toBe(1)
    })
  })

  it('should has list', () => {
    mockStore.level2SDK.edgeServices.retrieveEdge.mockClear()
    return import('../index').then(async ({ default: Notebook }) => {
      const notebook = Notebook
      await notebook.list()
      expect(
        mockStore.level2SDK.edgeServices.retrieveEdge.mock.calls.length,
      ).toBe(1)
    })
  })

  // Todo: share
  // it('should has share', () => {
  //   return import('../index').then(async ({ default: Notebook }) => {
  //     const notebook = Notebook
  //     await notebook.share(
  //       mockNotebook.id,
  //       mockData.phone_number,
  //       mockNotebook.info.edit_mode,
  //     )
  //     expect(log).toHaveBeenCalledWith(
  //       'Notebook->share',
  //       mockNotebook.id,
  //       mockData.phone_number,
  //       mockNotebook.info.edit_mode,
  //     )
  //   })
  // })

  // Todo: unshare
  // it('should has unshare', () => {
  //   return import('../index').then(async ({ default: Notebook }) => {
  //     const notebook = Notebook
  //     await notebook.unshare(mockNotebook.id, mockData.phone_number)
  //     expect(log).toHaveBeenCalledWith(
  //       'Notebook->unshare',
  //       mockNotebook.id,
  //       mockData.phone_number,
  //     )
  //   })
  // })
})
