// @ts-check
import _ from 'lodash';
import PrefixTree from './prefixTree';

const makeRouter = (routeList) => {
  console.dir(routeList, { depth: null });
  const routeTree = new PrefixTree(routeList);
  console.dir(routeTree, { depth: null });
  return {
    serve: (request) => {
      console.log(request);
      const path = typeof request === 'string' ? request : request.path;
      const method = request.method ?? 'GET';
      const pathParts = path.split('/').filter(_.identity);
      const routeData = routeTree.find(pathParts, method);
      if (routeData) {
        return routeData;
      }
      throw Error('no such route');
    },
  };
};

export default makeRouter;
