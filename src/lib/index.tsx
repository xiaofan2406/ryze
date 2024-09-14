import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import {unstable_batchedUpdates} from 'react-dom';
import memoizeOne from 'memoize-one';

type State = Record<string, unknown>;
type Subscriber = () => void;
type Updater<T extends State> = (prevState: T) => T;
type SelectorFunction<S, R> = (state: S) => R;
type Initializer<T extends State> = T | (() => T);

class Store<StoreState extends State> {
  #state: StoreState;
  #subscribers: Subscriber[];
  #initialState: StoreState;

  constructor(initializer: Initializer<StoreState> = {} as StoreState) {
    const initialState =
      typeof initializer === 'function'
        ? (initializer as () => StoreState)()
        : initializer;
    this.#state = initialState;
    this.#subscribers = [];
    this.#initialState = initialState;
  }

  reset = () => {
    this.#state = this.#initialState;
    this.#broadcast();
  };

  setState = (updater: Updater<StoreState>) => {
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

function defaultSelector<StoreState>(state: StoreState) {
  return state;
}

export function createStore<StoreState extends State>(
  initializer: Initializer<StoreState>
) {
  const store = new Store(initializer);

  function useSlice<Slice>(
    selector?: keyof StoreState | SelectorFunction<StoreState, Slice>
  ) {
    const getSnapshot = useMemo(() => {
      if (typeof selector === 'string') {
        // There is no need to memoize for string path selector
        // since we rely on user to update state in a immutable way
        // the result will only change if the value change
        return () => store.getState()[selector] as Slice;
      }

      const _selector = (selector ??
        defaultSelector<StoreState>) as SelectorFunction<StoreState, Slice>;
      // Memoizing the result against the selector
      // if a selector is different in every render,
      // - if it returns a path in state directly, it wont rerender as useSyncExternalStore takes care of that change
      // - if it returns a derived result from state, it will re render even if the result does not change
      // Therefore, it is important to declare ensure the selector has the same identity across renders
      const memoizedSelector = memoizeOne(_selector);
      return () => memoizedSelector(store.getState());
    }, [selector]);

    const slice = useSyncExternalStore<Slice>(store.subscribe, getSnapshot);

    return slice;
  }

  return {store, useSlice};
}

export function createStoreContext<StoreState extends State>() {
  const StoreContext = createContext(
    {} as ReturnType<typeof createStore<StoreState>>
  );

  function StoreProvider({
    children,
    initialState = {} as StoreState,
  }: {
    children: ReactNode;
    initialState?: Initializer<StoreState>;
  }) {
    const [value] = useState(() => createStore(initialState));

    return (
      <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
  }

  function useStore() {
    const {store} = useContext(StoreContext);
    return store;
  }

  function useSlice<Slice>(
    selector?: keyof StoreState | SelectorFunction<StoreState, Slice>
  ) {
    const {useSlice: useCtxSlice} = useContext(StoreContext);
    return useCtxSlice(selector);
  }

  const StoreConsumer = StoreContext.Consumer;

  return {StoreProvider, StoreConsumer, useStore, useSlice};
}
