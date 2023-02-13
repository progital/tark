import type { EntryContext, RouteComponent } from '@remix-run/node';

export function removeOldHead(parent: HTMLElement) {
  let foundOldHeader = false;
  const nodesToRemove: ChildNode[] = [];

  for (const node of parent.childNodes) {
    // console.log(node.nodeName, node.nodeValue);
    if (!foundOldHeader && node.nodeName !== '#comment') {
      continue;
    }

    if (
      foundOldHeader &&
      node.nodeName === '#comment' &&
      node.nodeValue === `end head`
    ) {
      nodesToRemove.push(node);
      break;
    }

    if (
      foundOldHeader ||
      (node.nodeName === '#comment' && node.nodeValue === `start head`)
    ) {
      foundOldHeader = true;
      nodesToRemove.push(node);
    }
  }

  for (const node of nodesToRemove) {
    node.remove();
  }
}

export function switchRootComponent(
  remixContext: EntryContext,
  Head: RouteComponent
): EntryContext {
  let serverHandoffString = remixContext.serverHandoffString;

  if (serverHandoffString) {
    let serverHandoff = JSON.parse(serverHandoffString);
    // remove errors from JSON string
    delete serverHandoff?.state?.errors;
    serverHandoffString = JSON.stringify(serverHandoff);
  }

  return {
    ...remixContext,
    serverHandoffString,
    staticHandlerContext: {
      ...remixContext.staticHandlerContext,
      errors: null, // remove errors from context
    },
    routeModules: {
      ...remixContext.routeModules,
      root: {
        ...remixContext.routeModules.root,
        default: Head,
      },
    },
  };
}
