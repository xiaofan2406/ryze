import React from 'react';
import PropTypes from 'prop-types';

const Anchor = ({ href, children, ...rest }) => (
  <a rel="noopener noreferrer" target="_blank" href={href} {...rest}>
    {children}
  </a>
);

Anchor.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Anchor;
