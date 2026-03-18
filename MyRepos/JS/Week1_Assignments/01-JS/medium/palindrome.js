function isPalindrome(str) {
  if (str.length == 0)
    return true;
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const compareStr = cleanStr.split('').reverse().join('');

  if(compareStr === cleanStr){
    return true;
  }
  return false;
}

module.exports = isPalindrome;