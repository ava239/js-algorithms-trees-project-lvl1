export default class PrefixTreeNode {
  constructor(name = '', meta = null) {
    this.name = name;
    this.meta = meta;
    this.children = [];
  }

  addChild(addName, meta = null) {
    const child = this.getChild(addName);
    if (child) {
      return child;
    }
    const newChild = new PrefixTreeNode(addName, meta);
    this.children = [...this.children, newChild];
    return newChild;
  }

  getChild(searchName) {
    return this.children.find(({ name }) => name === searchName);
  }
}
