module.exports = {
  variants: {
    borderWidth: ['responsive', 'hover'],
  },
  purge: ['./src/**/*.js'],
  animations: {
    spin: {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
  },
};
