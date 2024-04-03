import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import Loading from 'components/common/Loading'

/*
*  HAS EARLY ACCESS IS REQUIRED TO GET PASSED AUTH WALL
*/

const UserIsAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => '/',
  allowRedirectBack: true,
  authenticatedSelector: ({ firebase: { auth, profile } }) => {
    return auth && auth.isLoaded && !auth.isEmpty && profile.hasEarlyAccess
  },
  authenticatingSelector: ({ firebase: { auth, profile } }) =>
    auth === undefined || !auth.isLoaded || !profile.isLoaded,
  AuthenticatingComponent: Loading,
  wrapperDisplayName: 'userIsAuthenticated'
})

export default UserIsAuthenticated
