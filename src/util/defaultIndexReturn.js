const defaultIndexReturn = (sequelizeIndexResult, limit) => {
  return {
    pages:
      sequelizeIndexResult.count > 0
        ? Math.ceil(sequelizeIndexResult.count / limit)
        : 0,
    count: sequelizeIndexResult.count,
    items: sequelizeIndexResult.rows,
  };
};
export default defaultIndexReturn;
