// @ts-check

const makeRouter = (routeList) => {
  const router = {
    routes: {},
    serve: (path) => {
      const { routes } = router;
      const [handlerFn, params] = Object.entries(routes).reduce((acc, [name, handler]) => {
        const [foundHandler] = acc;
        if (foundHandler !== null) {
          return acc;
        }
        const regexp = name
          .replace('/', '\\/')
          .replace(/:(\w+)/gi, '(?<$1>\\w+)');
        const match = path.match(new RegExp(`^${regexp}$`));
        if (match !== null) {
          const { groups = {} } = match;
          return [handler, { ...groups }];
        }
        return acc;
      }, [null, null]);
      if (handlerFn !== null) {
        return { handler: handlerFn, params };
      }
      throw Error('no such route');
    },
  };

  routeList.forEach(({ path, handler }) => {
    router.routes[path] = handler;
  });

  return router;
};

export default makeRouter;
