import { useEffect, useRef } from "react";

type Handler = (event: any) => void;

interface Observable {
  on: (name: string, fn: Handler) => void;
  off: (name: string, fn: Handler) => void;
  [x: string]: any;
}

export const useEventListener = (
  eventName: string,
  handler: Handler,
  observable: Observable
) => {
  const savedHandler = useRef<Handler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: any) => savedHandler.current?.(event);
    observable.on(eventName, eventListener);
    return () => {
      observable.off(eventName, eventListener);
    };
  }, [eventName, observable]);
};
