import {createStoreContext} from './lib';

const Ctx = createStoreContext();

export const StoreProvider = Ctx.Provider;
export const useStore = Ctx.useStore;
export const useSlice = Ctx.useSlice;
export const useSetState = Ctx.useSetState;
