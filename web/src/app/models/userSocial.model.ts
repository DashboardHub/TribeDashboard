import { Social } from './social.model';

export interface UserSocial {
  github?: Social;
  twitter?: Social;
  youtube?: Social;
  instagram?: Social;
  userId: string;
  id?: string;
  empty?: boolean;
}
