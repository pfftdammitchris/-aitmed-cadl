/**
 * Account Utils Types
 */
export interface DecodeUID {
  (uid: string): { userId: string; phone_number: string }
}
