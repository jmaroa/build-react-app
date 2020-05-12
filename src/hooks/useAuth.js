import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { history } from 'store';
import useOrganizations from 'hooks/useOrganizations';

const useAuth = () => {
  const state = useSelector((authState) => authState.auth);
  const { authenticatedUser } = useSelector(
    (authState) => ({
      authenticatedUser: authState.auth.authenticatedUser,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const { fetchOrganizations } = useOrganizations();
  const { isLoggedIn: initialState } = state;
  const [triggerFetch, setTriggerFetch] = useState(!!initialState);

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      // Avoid race condition's conflict
      if (!isMounted) {
        return;
      }

      try {
        const data = await Auth.currentAuthenticatedUser();
        if (data) {
          dispatch.auth.setAuth({
            payload: {
              ...data.signInUserSession,
              attributes: { ...data.attributes },
            },
          });
        }
      } catch (error) {
        console.log(
          'Error while getting the current authenticated user::: ',
          error
        );
        dispatch.auth.setError({ payload: 'Error while authenticating' });
      }
    };

    fetchUserData();

    return function cleanup() {
      isMounted = false;
    };
  }, [dispatch.auth, triggerFetch]);

  const getAuthenticatedUser = async () => {
    await dispatch.auth.getAuthenticatedUser();
  };

  const handleLogout = async () => {
    await Auth.signOut()
      .then(() => setTriggerFetch(false))
      .catch((error) => console.log('error :::', error));
  };

  const handleLogin = (username, password) => {
    dispatch.app.storeIsLoading(true);
    // Sign in to the app using Amplify
    Auth.signIn({ username, password })
      .then(() => {
        // Get the authenticated user info
        getAuthenticatedUser()
          .then(() => {
            fetchOrganizations();
            setTriggerFetch(true);
            dispatch.auth.setError({ payload: '' });
            dispatch.app.storeIsLoading(false);
          })
          .catch(() => {
            dispatch.app.storeIsLoading(false);
            handleLogout();
            history.push('/login-fail');
          });
      })
      .catch(() => {
        dispatch.app.storeIsLoading(false);
        history.push('/login-fail');
      });
  };

  return { state, handleLogout, handleLogin, authenticatedUser };
};

export default useAuth;
