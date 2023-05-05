import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type Subscriber<T> = (state: T) => void;
type Updater<T> = (prevState: T) => T;

type State = Record<string, unknown>;

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
      this.#subscribers = this.#subscribers.filter(sub => sub === sub);
    };
  };

  #broadcast = () => {
    this.#subscribers.forEach(subscriber => {
      subscriber(this.getState());
    });
  };
}

function useFnRef<T>(fn: T) {
  const ref = useRef(fn);

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return ref;
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

  function useSlice(selector: (state: T) => unknown = defaultSelector) {
    const store = useStore();
    const selectorRef = useFnRef(selector);

    const [slice, setSlice] = useState(() => selector(store.getState()));

    useEffect(() => {
      store.subscribe(storeState => setSlice(selectorRef.current(storeState)));
    }, [store, selectorRef]);

    return slice;
  }

  function useSetState() {
    const store = useStore();
    return store.setState;
  }

  return {
    StoreProvider,
    StoreConsumer: StoreContext.Consumer,
    useStore,
    useSlice,
    useSetState,
  };
}

export default createStoreContext;
