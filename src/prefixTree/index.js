import PrefixTreeNode from './node';

export default class PrefixTree {
  constructor(config = {}) {
    const tree = new PrefixTreeNode();
    const routes = config.map(({ path, handler }) => {
      const routeParts = path.split('/').slice(1).map((part) => {
        if (part.match(/^:\w+$/)) {
          return ':param';
        }
        return part;
      });
      const matches = path.match(/:(\w+)/gi) ?? [];
      const params = matches.map((param) => param.substr(1));
      return { routeParts, handler, params };
    });
    routes.forEach(
      ({ routeParts, handler, params }) => tree.addDeepChild(routeParts, { handler, params }),
    );
    this.tree = tree;
  }

  getTree() {
    return this.tree;
  }

  find(pathParts, node = this.getTree(), capturedParams = []) {
    if (pathParts.length === 0) {
      const { handler, params } = node.meta;
      const mappedParams = params.map((name, key) => [name, capturedParams[key]]);
      return { handler, params: Object.fromEntries(mappedParams) };
    }
    const [head, ...rest] = pathParts;
    if (node.hasChild(head)) {
      return this.find(rest, node.getChild(head), capturedParams);
    }
    if (node.hasChild(':param')) {
      const newCapturedParams = [...capturedParams, head];
      return this.find(rest, node.getChild(':param'), newCapturedParams);
    }
    return null;
  }
}
