function getRandomNum(lbound, ubound) {
  return Math.floor(Math.random() * (ubound - lbound)) + lbound;
}
function getRandomChar(number, lower, upper, other) {
  const numberChars = '0123456789';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const otherChars = '`~!@#$%^&*()-_=+[{]}|;:,<.>/?';
  let charSet = '';
  if (number === true) charSet += numberChars;
  if (lower === true) charSet += lowerChars;
  if (upper === true) charSet += upperChars;
  if (other === true) charSet += otherChars;
  return charSet.charAt(getRandomNum(0, charSet.length));
}
function passwordGenerator(
  length,
  firstNumber = true,
  firstLower = true,
  firstUpper = true,
  firstOther = true,
  latterNumber = true,
  latterLower = true,
  latterUpper = true,
  latterOther = true
) {
  let rc = '';
  if (length > 0)
    rc += getRandomChar(firstNumber, firstLower, firstUpper, firstOther);
  // eslint-disable-next-line no-plusplus
  for (let idx = 1; idx < length; ++idx) {
    rc += getRandomChar(latterNumber, latterLower, latterUpper, latterOther);
  }
  return rc;
}
export default passwordGenerator;
