import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const subRoutes = ['About', 'Contact'];

const NAV_LINKS = [
  {
    to: '/',
    name: 'Home',
  },
  ...subRoutes.map(name => ({
    to: `/${name.toLowerCase()}`,
    name,
  })),
];

const linkClassNames = 'p-1 inline-block hover:bg-gray-100';

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 bottom-0 m-2 flex flex-col border-solid border border-gray-100">
      {NAV_LINKS.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={[
            linkClassNames,
            location.pathname === link.to &&
              'border-r-2 border-solid border-blue-500',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
