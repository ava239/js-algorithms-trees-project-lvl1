// @ts-check
import _ from 'lodash';
import PrefixTree from './prefixTree';

const makeRouter = (routeList) => {
  const routeTree = new PrefixTree(routeList);
  return {
    serve: (request) => {
      const path = typeof request === 'string' ? request : request.path;
      const method = request.method ?? 'GET';
      const pathParts = path.split('/').filter(_.identity);
      const routeData = routeTree.find(pathParts, method);
      if (!path || !routeData) {
        throw Error('no such path');
      }
      return routeData;
    },
  };
};

export default makeRouter;
