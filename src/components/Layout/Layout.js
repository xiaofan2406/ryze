import React from 'react';
import PropTypes from 'prop-types';
import Brand from './Brand';

const Layout = ({ children }) => (
  <div className="font-sans text-base text-gray-800">
    <Brand />
    <div className="my-4 mx-auto w-3/4">{children}</div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
