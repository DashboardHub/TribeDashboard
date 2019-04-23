import { Social } from './social.model';

export interface UserSocial {
  github?: Social;
  twitter?: Social;
  youtube?: Social;
  instagram?: Social;
  uid: string;
  id?: string;
  empty?: boolean;
}
