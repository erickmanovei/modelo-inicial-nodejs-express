import { Op } from 'sequelize';

const addFiltersAndOrder = ({
  page = null,
  perPage = null,
  filterKeyAnd = null,
  filterKeyOr = null,
  filterValueAnd = null,
  filterValueOr = null,
  orderBy = null,
  whereNull = null,
  whereNotNull = null,
}) => {
  let offset = 0;
  let limit = 10;

  if (page && perPage) {
    offset = parseInt((page - 1) * perPage, 10);
    limit = parseInt(perPage, 10);
  }

  const whereOr = [];
  if (filterKeyOr && filterValueOr) {
    filterKeyOr.forEach((e, index) => {
      whereOr.push({ [e]: { [Op.like]: `%${filterValueOr[index]}%` } });
    });
  }

  const where =
    whereOr.length > 0
      ? {
          [Op.or]: whereOr,
        }
      : {};

  if (
    filterKeyAnd &&
    Array.isArray(filterKeyAnd) &&
    filterValueAnd &&
    Array.isArray(filterValueAnd)
  ) {
    filterKeyAnd.forEach((e, index) => {
      where[e] = { [Op.like]: `%${filterValueAnd[index]}%` };
    });
  }

  if (whereNull) {
    whereNull.forEach(e => {
      where[e] = { [Op.is]: null };
    });
  }

  if (whereNotNull) {
    whereNotNull.forEach(e => {
      where[e] = { [Op.not]: null };
    });
  }

  const order = [];

  if (orderBy && Array.isArray(orderBy)) {
    order.push(
      ...orderBy.map(e => {
        const [field, type] = e.split(':');
        return [field, type.toUpperCase()];
      })
    );
  }

  return { where, order, offset, limit };
};
export default addFiltersAndOrder;
