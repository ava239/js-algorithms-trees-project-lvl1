export default class PrefixTreeNode {
  constructor(name = '', meta = null) {
    this.name = name;
    this.meta = meta;
    this.children = [];
  }

  addChild(addName, meta = null) {
    if (this.hasChild(addName)) {
      return this.getChild(addName);
    }
    const newChild = new PrefixTreeNode(addName, meta);
    this.children = [...this.children, newChild];
    return newChild;
  }

  addDeepChild(path, meta) {
    const [head, ...rest] = path;
    if (path.length === 1) {
      return this.addChild(head, meta);
    }
    const child = this.addChild(head);
    return child.addDeepChild(rest, meta);
  }

  hasChild(searchName) {
    return Boolean(this.getChild(searchName));
  }

  getChild(searchName) {
    return this.children.find(({ name }) => name === searchName);
  }
}
