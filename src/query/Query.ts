import { Observer } from "./Observer";

export type QueryFn<Data> = (...args: unknown[]) => Promise<Data>;
export type QueryState<Data> = {
  data: Data | undefined;
  status: "pending" | "success" | "error";
  isFetching: boolean;
  error: string | undefined;
  lastUpdated: number | undefined;
};

export interface QueryConstructorParams<Data> {
  key: string;
  queryFn: QueryFn<Data>;
}

export class Query<Data> {
  readonly key;
  readonly queryFn;
  hash: string;
  subscribers: Observer<Data>[] = [];
  state: QueryState<Data>;

  constructor({ key, queryFn }: QueryConstructorParams<Data>) {
    this.key = key;
    this.queryFn = queryFn;
    this.hash = JSON.stringify(key);
    this.state = {
      status: "pending",
      isFetching: false,
      data: undefined,
      error: undefined,
      lastUpdated: undefined,
    };
  }

  subscribe(subscriber: Observer<Data>) {
    this.subscribers.push(subscriber);
  }

  // TODO: replace with hashmap delete
  unsubscribe(subscriber: Observer<Data>) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  #setState(updateFn: (old: QueryState<Data>) => QueryState<Data>) {
    this.state = updateFn(this.state);
    this.subscribers.forEach((s) => s.notify());
  }

  async fetch() {
    (async () => {
      if (!this.state.isFetching) {
        this.#setState((old) => ({
          ...old,
          isFetching: true,
          error: undefined,
        }));
        try {
          const data = await this.queryFn();
          this.#setState((old) => ({
            ...old,
            data,
            status: "success",
            lastUpdated: Date.now(),
          }));
        } catch (error) {
          let errorMessage = undefined;
          if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = String(error);
          }
          this.#setState((old) => ({
            ...old,
            status: "error",
            error: errorMessage,
          }));
        } finally {
          this.#setState((old) => ({ ...old, isFetching: false }));
        }
      }
    })();
  }
}
