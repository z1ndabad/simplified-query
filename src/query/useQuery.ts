import { useContext, useEffect, useRef, useState } from "react";
import { QueryClientContext } from "./QueryClientContext";
import { Observer, ObserverParams } from "./Observer";
import { QueryClient } from "./QueryClient";

export function useQuery<Data>({
  key,
  queryFn,
  staleTime,
}: ObserverParams<Data>) {
  const context = useContext(QueryClientContext) as QueryClient;
  const observer = useRef(new Observer(context, { key, queryFn, staleTime }));

  const [, setCount] = useState(0);
  const rerenderFn = () => setCount((prev) => prev + 1);

  useEffect(() => {
    const obs = observer.current;
    obs.subscribe(rerenderFn);
    return () => obs.unsubscribe();
  }, []);

  return observer.current.getQueryState();
}
