import PrefixTreeNode from './node';

export default class PrefixTree {
  constructor(config = {}) {
    this.config = config;
    const methods = this.getConfigMethodsList();
    const treesByMethod = methods.reduce(
      (acc, methodName) => ({ ...acc, [methodName]: new PrefixTreeNode() }),
      {},
    );
    const routes = config.map(this.parsePath);
    this.tree = routes.reduce((acc, { path: { parts, params, constraints }, handler, method }) => {
      acc[method].addDeepChild(parts, { handler, params, constraints });
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

  // eslint-disable-next-line class-methods-use-this
  parsePath(pathData) {
    const {
      path,
      handler,
      method = 'GET',
      constraints = {},
    } = pathData;
    const parts = path.split('/').slice(1).map((part) => {
      if (part.match(/^:\w+$/)) {
        return ':param';
      }
      return part;
    });
    const matches = path.match(/:(\w+)/gi) ?? [];
    const params = matches.map((param) => param.substr(1));
    return { path: { parts, params, constraints }, handler, method };
  }

  getTree(method) {
    return this.tree[method];
  }

  find(pathParts, method = 'GET', node = this.getTree(method), capturedParams = []) {
    if (pathParts.length === 0) {
      const { handler, params, constraints } = node.meta;
      const mappedParams = params.map((name, key) => [name, capturedParams[key]]);
      mappedParams.forEach(([name, value]) => {
        const constraint = constraints[name] ?? null;
        if (!constraint) {
          return;
        }
        console.log(constraint, value);
        switch (typeof constraint) {
          case 'function':
            if (!constraint(value)) {
              throw new Error(`param ${name} does not match constraint`);
            }
            break;
          case 'string':
            if (!value.match(new RegExp(constraint))) {
              throw new Error(`param ${name} does not match constraint`);
            }
            break;
          default:
            if (!value.match(constraint)) {
              throw new Error(`param ${name} does not match constraint`);
            }
        }
      });
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
