// @ts-check

const makeRouter = (routeList) => {
  const router = {
    routes: {},
    serve: (path) => {
      const { routes } = router;
      if (!Object.keys(routes).includes(path)) {
        throw Error('no such route');
      }
      return routes[path];
    },
  };

  routeList.forEach(({ path, handler }) => {
    router.routes[path] = handler;
  });

  return router;
};

export default makeRouter;
