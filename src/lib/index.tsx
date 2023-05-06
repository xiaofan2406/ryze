import {useMemo} from 'react';
import memoizeOne from 'memoize-one';
import {unstable_batchedUpdates} from 'react-dom';
import useSyncExternalStore from './useSyncExternalStore';

type State = Record<string, unknown>;

type Subscriber<T extends State> = (state: T) => void;
type Updater<T extends State> = (prevState: T) => T;
type ValueOf<T> = T[keyof T];

class Store<StoreState extends State> {
  #state: StoreState;
  #subscribers: Subscriber<StoreState>[];
  #_initialState: StoreState;

  constructor(initialState = {} as StoreState) {
    this.#state = initialState;
    this.#subscribers = [];
    this.#_initialState = initialState;
  }

  reset = () => {
    this.#state = this.#_initialState;
    this.#subscribers = [];
  };

  setState = (updater: Updater<StoreState>) => {
    this.#state = updater(this.getState());
    this.#broadcast();
  };

  getState = () => this.#state;

  subscribe = (sub: Subscriber<StoreState>) => {
    this.#subscribers.push(sub);
    return () => {
      this.#subscribers = this.#subscribers.filter((entry) => entry !== sub);
    };
  };

  #broadcast = () => {
    unstable_batchedUpdates(() => {
      this.#subscribers.forEach((subscriber) => {
        subscriber(this.getState());
      });
    });
  };
}

function createStoreContext<StoreState extends State>(
  initialState: StoreState
) {
  const store = new Store(initialState);

  type SelectorFunction<R> = (state: StoreState) => R;

  function defaultSelector(state: StoreState) {
    return state;
  }

  function useSlice(): State;
  function useSlice<Slice>(selector: SelectorFunction<Slice>): Slice;
  // TODO how to infer the type of value directly
  function useSlice<Slice extends ValueOf<StoreState>>(
    selector: keyof StoreState
  ): Slice;
  function useSlice<Slice>(selector: unknown = defaultSelector) {
    const getSnapshot = useMemo(() => {
      if (typeof selector === 'string') {
        // There is no need to memoize for string path selector
        // since we rely on user to update state in a immutable way
        // the result will only change if the value change
        return () => store.getState()[selector] as ValueOf<StoreState>;
      }

      // Memoizing the result against the selector
      // if a selector is different in every render,
      // - if it returns a path in state directly, it wont rerender as useSyncExternalStore takes care of that change
      // - if it returns a derived result from state, it will re render even if the result does not change
      // Therefore, it is important to declare ensure the selector has the same identity across renders
      const memo = memoizeOne(selector as SelectorFunction<Slice>);
      return () => memo(store.getState());
    }, [selector]);

    const slice = useSyncExternalStore<Slice | ValueOf<StoreState>>(
      store.subscribe,
      getSnapshot
    );

    return slice;
  }

  return {store, useSlice};
}

export default createStoreContext;
