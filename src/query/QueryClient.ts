import { Query, QueryConstructorParams } from "./Query";

export class QueryClient {
  queries: Map<string, Query<unknown>> = new Map();

  getQuery = <Data>({ key, queryFn }: QueryConstructorParams<Data>) => {
    // let res: InstanceType<typeof Query<Data>>;
    let res: Query<Data>;
    const hash = JSON.stringify(key);

    // TODO: replace query array with map, remove this check
    if (this.queries.has(hash)) {
      res = this.queries.get(hash);
    } else {
      res = new Query({ key, queryFn });
    }
    this.queries.set(hash, res);
    return res;
  };
}
