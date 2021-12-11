// @ts-check
import PrefixTree from './prefixTree';

const makeRouter = (routeList) => {
  const routeTree = new PrefixTree(routeList);
  return {
    serve: (request) => {
      const path = typeof request === 'string' ? request : request.path;
      const method = request.method ?? 'GET';
      const pathParts = path.split('/').slice(1);
      const routeData = routeTree.find(pathParts, method);
      if (routeData) {
        return routeData;
      }
      throw Error('no such route');
    },
  };
};

export default makeRouter;
