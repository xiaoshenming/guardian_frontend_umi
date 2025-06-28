/**
 * @see https://umijs.org/docs/max/access#access
 * */
import { User } from './services/guardian/api';

export default function access(initialState: { currentUser?: User } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canGuardian: currentUser && (currentUser.role === 'admin' || currentUser.role === 'guardian'),
    canUser: !!currentUser,
  };
}
