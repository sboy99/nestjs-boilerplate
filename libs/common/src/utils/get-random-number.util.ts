// generate a random number to a max range
export const getRandomNumber = (range: number): string => {
  const randomNumber = Math.floor(Math.random() * (range - 1)) + 1;
  const randomNumberString = randomNumber.toString();
  const rangeLength = range.toString();
  let trailingZeros = '';

  for (let i = 0; i < rangeLength.length - randomNumberString.length; i++) {
    trailingZeros += '0';
  }
  return trailingZeros + randomNumberString;
};
