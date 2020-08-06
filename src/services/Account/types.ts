import { Status } from '../../common/types'
/**
 * Account Types
 */
export interface VertexName {
  name: string
}

export interface ProfileInDocument {
  first_name: string
  middle_name?: string
  last_name: string

  gender: 'MALE' | 'FEMALE' | 'PNS'
  birthday: number
  languages?: string[]

  profile_photo?: string
}

export interface Profile extends Omit<ProfileInDocument, 'profile_photo'> {
  profile_photo?: Blob
}
export interface User extends VertexName {
  id: string
  userId: string
  phone_number: string
  profile: Profile | null
}

export interface RequestVerificationCode {
  (phone_number: string): Promise<string | null>
}

// Create User
export interface Create {
  (
    phone_number: string,
    password: string,
    verification_code: number,
    name: string,
  ): Promise<void>
}

// Login
export interface Login {
  (phone_number: string, password: string, verification_code: string): Promise<
    any
  >
}

// LoginByPassword
export interface LoginByPassword {
  (password: string): Promise<any>
}
// LoginByVerificationCode
export interface LoginByVerificationCode {
  (phone_number: string, verification_code: string): Promise<void>
}

// Logout
export interface Logout {
  (clean?: boolean): ReturnType<GetStatus>
}

// Update
export type UpdateParams = Partial<Omit<Profile, 'roles'>>
export interface Update {
  (params: UpdateParams): Promise<User>
}

// UpdatePassword
export interface UpdatePassword {
  (old_password: string, new_password: string): Promise<void>
}

// UpdatePasswordByVerificationCode
export interface UpdatePasswordByVerificationCodeParams {
  phone_number: string
  verification_code: string
  new_password: string
}
export interface UpdatePasswordByVerificationCode {
  (params: UpdatePasswordByVerificationCodeParams): Promise<void>
}

// UpdateProfile
export interface UpdateProfile {
  (profile: Profile): Promise<User>
}

// Retrieve
export interface Retrieve {
  (): Promise<User>
}

// Remove
export interface Remove {
  (): Promise<User>
}

// GetStatus
export interface GetStatus {
  (): Promise<
    Status & {
      userId: string
      phone_number: string
    }
  >
}
