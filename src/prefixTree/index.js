import _ from 'lodash';
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
    const parts = path.split('/')
      .filter(_.identity)
      .map((part) => {
        if (part.match(/^:\w+$/)) {
          return ':param';
        }
        return part;
      });
    const matches = path.match(/:(\w+)/gi) ?? [];
    const params = matches.map((param) => param.substr(1));
    const preparedConstraints = _.reduce(constraints, (acc, constraint, key) => {
      switch (typeof constraint) {
        case 'function':
          return { ...acc, [key]: constraint };
        case 'string':
          return { ...acc, [key]: (value) => value.match(new RegExp(constraint)) };
        default:
          return { ...acc, [key]: (value) => value.match(constraint) };
      }
    }, {});
    return { path: { parts, params, constraints: preparedConstraints }, handler, method };
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
        if (!constraint(value)) {
          throw new Error(`param ${name} does not match constraint`);
        }
      });
      return { handler, params: Object.fromEntries(mappedParams) };
    }
    const [head, ...rest] = pathParts;
    const child = node.getChild(head);
    if (child) {
      return this.find(rest, method, child, capturedParams);
    }
    const paramChild = node.getChild(':param');
    if (paramChild) {
      const newCapturedParams = [...capturedParams, head];
      return this.find(rest, method, paramChild, newCapturedParams);
    }
    return null;
  }
}
