//统计数组中有多少个重复的单词：
// let counts = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
// console.log('数组counts中"李"出现的次数是：' + counts(["李", "李", "设", "弟", "弟", "生", "生", "李"], "李"));
// 不用reduce时：
/**
 * 统计数组中有多少个重复的单词
 * @param {Array} array 待分页的数组
 * @return {Object}  统计后的对象
 */
function getRepeatNum(array) {
  let obj = {};
  // let newArr = [].concat.apply([], arr)//只能将二维转一维
  let newArr = array.flat();//es6的flat()方法将多维转一维
  for (let i = 0, l = newArr.length; i < l; i++) {
    let item = newArr[i].toLowerCase();//转小写
    obj[item] = (obj[item] + 1) || 1;
  }

  return obj;
}
let arr = ["李", "李", "设", "弟", "弟", "生", "生", "李"];
// console.log(getRepeatNum(arr));
module.exports = {
  getRepeatNum
}