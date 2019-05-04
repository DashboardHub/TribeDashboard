import { Account } from './account.model';

export interface User {
  github?: Account;
  twitter?: Account;
  youtube?: Account;
  instagram?: Account;
  uid: string;
}
