const { APP_URL } = process.env;

exports.pageInfo = (total, limit, page, route, queryParams = '') => {
  const last = Math.ceil(total / limit);
  const pageInfo = {
    prev: page > 1 ? `${APP_URL}/${route}?page=${page - 1}&${queryParams}` : null,
    next: page < last ? `${APP_URL}/${route}?page=${page + 1}&${queryParams}` : null,
    totalData: total,
    currentPage: page,
    lastPage: last,
  };
  return pageInfo;
};
