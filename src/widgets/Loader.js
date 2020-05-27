/**
 * @see https://github.com/yuanyan/halogen/blob/master/src/RingLoader.js
 */
import React from 'react';

const ringClassNames =
  'border-solid border-blue-200 border-8 opacity-4 rounded-full absolute top-0 left-0 w-20 h-20';

const Loader = () => {
  return (
    <div className="inline-block">
      <div className="relative w-20 h-20">
        <div className={`${ringClassNames} rotate-right fill-forwards`} />
        <div className={`${ringClassNames} rotate-left fill-forwards`} />
      </div>
    </div>
  );
};

export default Loader;
