import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type {ReactNode} from 'react';
import {unstable_batchedUpdates} from 'react-dom';
import memoizeOne from 'memoize-one';

type State = Record<string, unknown>;
type Subscriber = () => void;
type Initializer<T> = T | (() => T);

export class Store<StoreState extends State> {
  #state: StoreState;
  #subscribers: Subscriber[];
  #initialState: StoreState;

  constructor(initializer: Initializer<StoreState> = {} as StoreState) {
    const initialState =
      typeof initializer === 'function' ? initializer() : initializer;
    this.#state = initialState;
    this.#subscribers = [];
    this.#initialState = initialState;
  }

  reset = () => {
    this.#state = this.#initialState;
    this.#broadcast();
  };

  setState = (updater: (prevState: StoreState) => StoreState) => {
    this.#state = updater(this.getState());
    this.#broadcast();
  };

  getState = () => this.#state;

  subscribe = (sub: Subscriber) => {
    this.#subscribers.push(sub);
    return () => {
      this.#subscribers = this.#subscribers.filter((entry) => entry !== sub);
    };
  };

  #broadcast = () => {
    unstable_batchedUpdates(() => {
      this.#subscribers.forEach((subscriber) => {
        subscriber();
      });
    });
  };
}

export function useSlice<StoreState extends State>(
  store: Store<StoreState>
): StoreState;
export function useSlice<
  StoreState extends State,
  Key extends keyof StoreState,
>(store: Store<StoreState>, selector: Key): StoreState[Key];
export function useSlice<StoreState extends State, Result>(
  store: Store<StoreState>,
  selector: (state: StoreState) => Result
): Result;
export function useSlice<
  StoreState extends State,
  Key extends keyof StoreState,
  Result,
>(store: Store<StoreState>, selector?: Key | ((state: StoreState) => Result)) {
  const getSnapshot = useMemo(() => {
    if (!selector) return () => store.getState();

    if (typeof selector === 'function') {
      // Memoizing the result against the selector
      // if a selector is different in every render,
      // - if it returns a path in state directly, it wont rerender as useSyncExternalStore takes care of that change
      // - if it returns a derived result from state, it will re render even if the result does not change
      // Therefore, it is important to declare ensure the selector has the same identity across renders
      const memoizedSelector = memoizeOne(selector);
      return () => memoizedSelector(store.getState());
    }

    // There is no need to memoize for string path selector
    // since we rely on user to update state in a immutable way
    // the result will only change if the value change
    return () => store.getState()[selector];
  }, [store, selector]) as () => Result | StoreState[Key];

  const slice = useSyncExternalStore(store.subscribe, getSnapshot);

  return slice;
}

export function createStore<StoreState extends State>(
  initializer?: Initializer<StoreState>
) {
  const store = new Store(initializer);

  // @ts-expect-error This overload signature is not compatible with its implementation signature
  function useSliceProx(): StoreState;
  function useSliceProx<K extends keyof StoreState>(selector: K): StoreState[K];
  function useSliceProx<R>(selector: (state: StoreState) => R): R;
  function useSliceProx<K extends keyof StoreState, R>(
    selector?: K | ((state: StoreState) => R)
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useSlice(store, selector as any);
  }

  return {store, useSlice: useSliceProx};
}

export function createStoreContext<StoreState extends State>() {
  const StoreContext = createContext({} as Store<StoreState>);

  function StoreProvider({
    children,
    initialState = {} as StoreState,
  }: {
    children: ReactNode;
    initialState?: Initializer<StoreState>;
  }) {
    const [{store}] = useState(() => createStore(initialState));

    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  }

  function useStore() {
    const store = useContext(StoreContext);
    return store;
  }

  // @ts-expect-error This overload signature is not compatible with its implementation signature
  function useSliceProx(): StoreState;
  function useSliceProx<K extends keyof StoreState>(selector: K): StoreState[K];
  function useSliceProx<R>(selector: (state: StoreState) => R): R;
  function useSliceProx<K extends keyof StoreState, R>(
    selector?: K | ((state: StoreState) => R)
  ) {
    const store = useStore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useSlice(store, selector as any);
  }

  const StoreConsumer = StoreContext.Consumer;

  return {StoreProvider, StoreConsumer, useStore, useSlice: useSliceProx};
}
