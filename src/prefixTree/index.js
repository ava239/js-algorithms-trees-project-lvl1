import PrefixTreeNode from './node';

export default class PrefixTree {
  constructor(config = {}) {
    this.config = config;
    const methods = this.getConfigMethodsList();
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
    this.tree = routes.reduce((acc, route) => {
      const {
        routeParts,
        handler,
        params,
        method,
      } = route;
      acc[method].addDeepChild(routeParts, { handler, params });
      return acc;
    }, treesByMethod);
  }

  getConfigMethodsList() {
    return this.config.reduce((acc, { method = 'GET' }) => {
      if (acc.includes(method)) {
        return acc;
      }
      return [...acc, method];
    }, []);
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
