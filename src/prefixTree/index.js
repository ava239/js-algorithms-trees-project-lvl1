import PrefixTreeNode from './node';

export default class PrefixTree {
  constructor(config = {}) {
    const methods = config.reduce((acc, { method = 'GET' }) => {
      if (acc.includes(method)) {
        return acc;
      }
      return [...acc, method];
    }, []);
    const treesByMethod = methods.reduce(
      (acc, methodName) => ({ ...acc, [methodName]: new PrefixTreeNode() }),
      {},
    );
    const routes = config.map(({ path, handler, method = 'GET' }) => {
      const routeParts = path.split('/').slice(1).map((part) => {
        if (part.match(/^:\w+$/)) {
          return ':param';
        }
        return part;
      });
      const matches = path.match(/:(\w+)/gi) ?? [];
      const params = matches.map((param) => param.substr(1));
      return {
        routeParts,
        handler,
        params,
        method,
      };
    });
    routes.forEach(
      (
        {
          routeParts,
          handler,
          params,
          method,
        },
      ) => treesByMethod[method].addDeepChild(routeParts, { handler, params }),
    );
    this.tree = treesByMethod;
  }

  getTree(method) {
    return this.tree[method];
  }

  find(pathParts, method = 'GET', node = this.getTree(method), capturedParams = []) {
    if (pathParts.length === 0) {
      const { handler, params } = node.meta;
      const mappedParams = params.map((name, key) => [name, capturedParams[key]]);
      return { handler, params: Object.fromEntries(mappedParams) };
    }
    const [head, ...rest] = pathParts;
    if (node.hasChild(head)) {
      return this.find(rest, method, node.getChild(head), capturedParams);
    }
    if (node.hasChild(':param')) {
      const newCapturedParams = [...capturedParams, head];
      return this.find(rest, method, node.getChild(':param'), newCapturedParams);
    }
    return null;
  }
}
