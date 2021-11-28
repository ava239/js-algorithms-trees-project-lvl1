// @ts-check
import PrefixTree from './prefixTree';

const makeRouter = (routeList) => {
  const routeTree = new PrefixTree(routeList);
  return {
    serve: (path) => {
      const pathParts = path.split('/').slice(1);
      const routeData = routeTree.find(pathParts);
      if (routeData) {
        return routeData;
      }
      throw Error('no such route');
    },
  };
};

export default makeRouter;
