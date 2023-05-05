import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

// TODO drop react 16 support
import useSyncExternalStore from './useSyncExternalStore';

type Subscriber<T> = (state: T) => void;
type Updater<T> = (prevState: T) => T;

type State = Record<string, unknown>;

type SelectorFunction<T> = (state: T) => unknown;

class Store<T extends State> {
  #state: T;
  #subscribers: Subscriber<T>[];
  #_initialState: T;

  constructor(initialState = {} as T) {
    this.#state = initialState;
    this.#subscribers = [];
    this.#_initialState = initialState;
  }

  reset = () => {
    this.#state = this.#_initialState;
    this.#subscribers = [];
  };

  setState = (updater: Updater<T>) => {
    this.#state = updater(this.getState());
    this.#broadcast();
  };

  getState = () => this.#state;

  subscribe = (sub: Subscriber<T>) => {
    this.#subscribers.push(sub);
    return () => {
      this.#subscribers = this.#subscribers.filter(entry => entry !== sub);
    };
  };

  #broadcast = () => {
    this.#subscribers.forEach(subscriber => {
      subscriber(this.getState());
    });
  };
}

function defaultSelector<T>(state: T) {
  return state;
}

function createStoreContext<T extends State>() {
  const StoreContext = createContext({} as Store<T>);

  function StoreProvider({
    initialState,
    children,
  }: {
    initialState?: T;
    children: ReactNode;
  }) {
    const [store] = useState(() => new Store(initialState));

    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  }

  function useStore() {
    return useContext(StoreContext);
  }

  function useSlice(
    selector: SelectorFunction<T> | 'string' = defaultSelector
  ) {
    const store = useStore();

    const getSnapshot = useCallback(
      () =>
        typeof selector === 'string'
          ? store.getState()[selector]
          : selector(store.getState()),
      [selector, store]
    );
    const slice = useSyncExternalStore(store.subscribe, getSnapshot);

    return slice;
  }

  function useSetState() {
    const store = useStore();
    return store.setState;
  }

  // for getting state only in event handlers
  function useGetState() {
    const store = useStore();
    return store.getState;
  }

  return {
    StoreProvider,
    StoreConsumer: StoreContext.Consumer,
    useStore,
    useSlice,
    useSetState,
    useGetState,
  };
}

export default createStoreContext;
