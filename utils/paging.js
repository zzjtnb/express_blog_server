/**
 * 利用数组制作分页效果
 * @param {Number} currentPage 当前的页数
 * @param {Number} pageSize 一页的总数
 * @param {Array} array 待分页的数组
 * @return {Array}  newArr 分页后的数组
 */
exports.pagination = function (currentPage, pageSize, array) {
  // skipNum：跳过的数量
  const skipNum = (currentPage - 1) * pageSize;
  return (skipNum + pageSize >= array.length) ? array.slice(skipNum, array.length) : array.slice(skipNum, skipNum + pageSize)

}
// module.exports = {
//   pagination
// }