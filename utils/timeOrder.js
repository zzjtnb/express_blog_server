/**
 * 时间排序从晚到早
 * @param {Array} array 需要排序的数组
 * @return {Array}  newArr 排序后的数组
 */
exports.newTime = function (arr) {
  return arr.sort((a, b) => {
    return b.date.localeCompare(a.date, 'zh-Hans-CN');
  });
}
/**
 * 时间排序从早到晚
 * @param {Array} array 需要排序的数组
 * @return {Array}  newArr 排序后的数组
 */
exports.oldTime = function (arr) {
  return arr.sort((a, b) => {
    return a.date.localeCompare(b.date, 'zh-Hans-CN');
  });
}
// module.exports = {
//   pagination
// }