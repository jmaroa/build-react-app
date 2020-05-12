import React from 'react';
import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
  return <>{children}</>;
};

AdminLayout.propTypes = {
  children: PropTypes.object,
};

AdminLayout.defaultProps = {
  children: PropTypes.object,
};

export default AdminLayout;
