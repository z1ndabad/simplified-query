import { Query, QueryConstructorParams } from "./Query";
import { QueryClient } from "./QueryClient";

export interface ObserverParams<Data> extends QueryConstructorParams<Data> {
  staleTime: number;
}

export class Observer<Data> {
  query: Query<Data>;
  staleTime: number;
  rerenderTriggerFn = () => {
    console.error("Rerender function not set--subscribe to the query");
  };

  constructor(
    queryClient: QueryClient,
    { key, queryFn, staleTime }: ObserverParams<Data>,
  ) {
    this.query = queryClient.getQuery({ key, queryFn });
    this.staleTime = staleTime;
  }

  notify() {
    this.rerenderTriggerFn();
  }

  subscribe(rerenderTriggerFn: () => void) {
    this.rerenderTriggerFn = rerenderTriggerFn;
    this.query.subscribe(this);

    const queryState = this.getQueryState();

    if (
      !queryState.lastUpdated ||
      this.staleTime < Date.now() - queryState.lastUpdated
    ) {
      this.query.fetch();
    }
  }

  unsubscribe() {
    this.query.unsubscribe(this);
  }

  getQueryState() {
    return this.query.state;
  }
}
