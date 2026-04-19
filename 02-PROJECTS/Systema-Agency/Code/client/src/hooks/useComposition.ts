import * as React from "react";

type UseCompositionHandlers<T extends HTMLElement> = {
  onKeyDown?: (event: React.KeyboardEvent<T>) => void;
  onCompositionStart?: (event: React.CompositionEvent<T>) => void;
  onCompositionEnd?: (event: React.CompositionEvent<T>) => void;
};

/**
 * Minimal composition-event helper used by input/textarea components.
 * It keeps strong typing for keyboard/composition handlers and forwards events
 * without changing behavior.
 */
export function useComposition<T extends HTMLElement>(
  handlers: UseCompositionHandlers<T> = {}
) {
  const { onKeyDown, onCompositionStart, onCompositionEnd } = handlers;

  return {
    onKeyDown: React.useCallback(
      (event: React.KeyboardEvent<T>) => {
        onKeyDown?.(event);
      },
      [onKeyDown]
    ),
    onCompositionStart: React.useCallback(
      (event: React.CompositionEvent<T>) => {
        onCompositionStart?.(event);
      },
      [onCompositionStart]
    ),
    onCompositionEnd: React.useCallback(
      (event: React.CompositionEvent<T>) => {
        onCompositionEnd?.(event);
      },
      [onCompositionEnd]
    ),
  };
}
