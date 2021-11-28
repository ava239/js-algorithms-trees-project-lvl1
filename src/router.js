// @ts-check
import PrefixTree from './prefixTree';

const makeRouter = (routeList) => {
  const router = {
    routeTree: new PrefixTree(routeList),
    serve: (path) => {
      const pathParts = path.split('/').slice(1);
      const routeData = router.routeTree.find(pathParts);
      if (routeData) {
        return routeData;
      }
      throw Error('no such route');
    },
  };

  return router;
};

export default makeRouter;
