# Ryze

[![CI Status][ci-badge]][ci]
[![Coverage Status][coverage-badge]][coverage]
[![Dependencies Status][dependencies-badge]][dependencies]

[ci-badge]: https://github.com/xiaofan2406/ryze/workflows/Build/badge.svg
[ci]: https://github.com/xiaofan2406/ryze/actions
[coverage-badge]: https://img.shields.io/codecov/c/github/xiaofan2406/ryze.svg
[coverage]: https://codecov.io/gh/xiaofan2406/ryze/branches
[dependencies-badge]: https://img.shields.io/david/xiaofan2406/ryze.svg
[dependencies]: https://david-dm.org/xiaofan2406/ryze

## Getting started

```shell
git clone https://github.com/xiaofan2406/ryze.git
cd ryze
yarn
yarn dev
```

## Developing

## Commands

##### Development

```shell
yarn dev # start webpack-dev-server with hot reload enabled

yarn format # format all source code with prettier
```

##### Testing

```shell
yarn test # start jest in watch mode

yarn coverage # report coverage
```

##### Production

```shell
yarn build # create a minified production build

yarn start # start a localhost server serving the production build
```
