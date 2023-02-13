import * as React from 'react';

/** @see {@link https://github.com/mui/material-ui/issues/19450} */
export function RootAriaHiddenMuiBugFix({
  rootId = 'root',
}: {
  rootId?: string;
}) {
  const root =
    typeof document !== 'undefined' && document.getElementById(rootId);

  React.useEffect(() => {
    if (!root) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (root.getAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
    });

    observer.observe(root, {
      attributeFilter: ['aria-hidden'],
    });

    return () => {
      observer.disconnect();
    };
  }, [root]);

  return null;
}
