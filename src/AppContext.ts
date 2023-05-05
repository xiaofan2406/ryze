import createStoreContext from './lib';

const Ctx = createStoreContext();

export const StoreProvider = Ctx.StoreProvider;
export const useStore = Ctx.useStore;
export const useSlice = Ctx.useSlice;
export const useSetState = Ctx.useSetState;
