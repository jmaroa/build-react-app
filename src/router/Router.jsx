import { ConnectedRouter } from 'connected-react-router';
import { history } from 'store';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import useAuth from 'hooks/useAuth';

import routes from './routes';

const renderPage = (route) =>
  route.layout ? (
    <route.layout>
      <route.component />
    </route.layout>
  ) : (
    <route.component />
  );

const RenderRoute = ({ isLoggedIn, route, ...rest }) => {
  /**
   * If isLoggedIn is null means the auth validation has not been completed.
   * It should be either TRUE or FALSE.
   */
  if (isLoggedIn === null) {
    return '';
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        route.restricted && !isLoggedIn ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        ) : (
          renderPage(route)
        )
      }
    />
  );
};

const InitRoutes = () => {
  const {
    state: { isLoggedIn },
  } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="text-center pt-5">
          <span>Loading...</span>
        </div>
      }
    >
      <ConnectedRouter history={history}>
        <Router history={history}>
          <Switch>
            {routes.map((route) => (
              <RenderRoute
                key={route.key}
                path={route.path}
                exact={route.exact}
                isLoggedIn={isLoggedIn}
                route={route}
              />
            ))}
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Router>
      </ConnectedRouter>
    </Suspense>
  );
};

RenderRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  route: PropTypes.object,
  location: PropTypes.any,
};

RenderRoute.defaultProps = {
  isLoggedIn: PropTypes.bool,
  route: PropTypes.object,
  location: PropTypes.any,
};

export default InitRoutes;
