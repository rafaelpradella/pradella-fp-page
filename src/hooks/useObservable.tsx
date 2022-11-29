import { useEffect, Dispatch, SetStateAction } from "react";
import type { Observable } from "rxjs";

export default function useObservable<T>(observable: Observable<T>, setter: Dispatch<SetStateAction<T>>) {
  useEffect(() => {
    let subscription = observable.subscribe(res => setter(res));

    return () => subscription.unsubscribe();
  }, [ observable, setter ])
}