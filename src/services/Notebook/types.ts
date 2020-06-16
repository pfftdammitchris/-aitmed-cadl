/**
 * Notebook
 */
/**
 *  edit_mode: Decimal number which can be converted to be ninary
 *  |   0    |  0   |  0   |
 *  | invite | edit | view |
 *  0 - unable
 *  1 - able
 */
export interface Notebook {
  id: string
  owner_id: string

  info: {
    title: string
    description: string
    edit_mode: number
  }

  created_at: number
  modified_at: number
  // modified_by: string

  refid?: string | undefined

  isEncrypt: boolean
  type: number
}

//Invite
export interface Invite {
  id: string
  owner_id: string

  info: {
    notebook: {
      title: string,
      description?: string,
    },
    invitee: {
      name: string,
      phoneNumber: string
    },
    inviter: {
      name: string
    }
  }

  notebookId: string
  directedTo: string


  created_at: number
  modified_at: number
  // modified_by: string

  type: number
}
//AcceptedInvite
export interface AcceptedInvite {
  id: string
  owner_id: string

  info: {
    notebook: {
      title: string,
      description?: string,
    },
    invitee: {
      name: string,
      phoneNumber: string
    },
    inviter: {
      name: string
    }
  },

  inviteId: string
  directedTo: string


  created_at: number
  modified_at: number
  // modified_by: string

  type: number
}

// Create
export interface CreateParams {
  title: string
  description?: string
  type?: number
  isEncrypt?: boolean
}
export interface Create {
  (params: CreateParams): Promise<Notebook>
}

// Remove
export interface Remove {
  (id: string | Uint8Array): Promise<Notebook>
}

// Update
export interface UpdateFields {
  title?: string
  description?: string
}
export interface Update {
  (id: string | Uint8Array, fields: UpdateFields): Promise<Notebook>
}

// Retrieve
export interface Retrieve {
  (id: string | Uint8Array): Promise<Notebook>
}

// List
export interface ListParams {
  shared?: Boolean
  count?: number
  edit_mode?: number
  sort_by?: 0 | 1 | 2
  type?: number
  xfname?: string
  isEncrypt?: Boolean
}
export interface ListReturn {
  ids: string[]
  mapper: Record<string, Notebook>
}
export interface List {
  (params?: ListParams): Promise<ListReturn>
}
// ListSharedNotebooks
export interface ListSharedNotebooksParams {
  count?: number
  sort_by?: 0 | 1 | 2
  obfname?: string
}
export interface ListSharedNotebooksReturn {
  ids: string[]
  mapper: Record<string, Notebook>
}
export interface ListSharedNotebooks {
  (params?: ListSharedNotebooksParams): Promise<ListSharedNotebooksReturn>
}
// ListInvites
export interface ListInvitesParams {
  count?: number
  obfname?: string
  fromMe?: boolean
  sort_by?: 0 | 1 | 2
}
export interface ListInvitesReturn {
  ids: string[]
  mapper: Record<string, Invite>
}
export interface ListInvites {
  (params?: ListInvitesParams): Promise<ListInvitesReturn>
}
// ListAcceptedInvites
export interface ListAcceptedInvitesParams {
  count?: number
  obfname?: string
  sort_by?: 0 | 1 | 2
  fromMe?: boolean
}
export interface ListAcceptedInvitesReturn {
  ids: string[]
  mapper: Record<string, AcceptedInvite>
}
export interface ListAcceptedInvites {
  (params?: ListAcceptedInvitesParams): Promise<ListAcceptedInvitesReturn>
}

//CreateInvite
export interface CreateInviteParams {
  info: {
    notebook: {
      title: string,
    },
    invitee: {
      phoneNumber: string,
      name: string,
    },
    inviter: {
      name: string
    }
  },
  notebookId: string | Uint8Array,
  directedToId?: string | Uint8Array,
}

export interface CreateInvite {
  (params: CreateInviteParams): Promise<Invite>
}

//AcceptInvite
export interface AcceptInviteParams {
  info: {
    notebook: {
      title: string,
    },
    invitee: {
      phoneNumber: string,
      name: string,
    },
    inviter: {
      name: string
    }
  },
  inviteId: string | Uint8Array,
  directedToId: string | Uint8Array,
}

export interface AcceptInvite {
  (params: AcceptInviteParams): Promise<AcceptedInvite>
}

//AuthorizeEvent
export interface AuthorizeEventParams {
  info: {
    notebook: {
      title: string,
    },
    invitee: {
      phoneNumber: string,
      name: string,
    },
    inviter: {
      name: string
    }
  },
  acceptanceId: string | Uint8Array,
  directedToId: string | Uint8Array,
}

export interface AuthorizeEvent {
  (params: AuthorizeEventParams): Promise<Notebook>
}
