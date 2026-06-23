import { useSyncExternalStore } from "react";
import { isMac } from "../utils";

const subscribe = () => () => {};

export function useIsMac() {
  return useSyncExternalStore(subscribe, isMac, () => false);
}
