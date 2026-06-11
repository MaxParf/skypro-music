"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateAuthFromStorage } from "@/store/authSlice";
import { makeStore, type AppStore } from "@/store/store";

type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState<AppStore>(makeStore);

  useEffect(() => {
    void store.dispatch(hydrateAuthFromStorage());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
