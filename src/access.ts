/**
 * @see https://umijs.org/docs/max/access#access
 * */
import { UserInfo } from './services/auth';

export default function access(initialState: { currentUser?: UserInfo } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canGuardian: currentUser && (currentUser.role === 'admin' || currentUser.role === 'guardian'),
    canUser: !!currentUser,
  };
}
