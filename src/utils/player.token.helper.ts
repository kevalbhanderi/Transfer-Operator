/**
 * To generate a random string
 * @param type type[number/string] of string to be generated
 */
export const generatePlayerToken = async (length: number) => {
  let charSet = '';
  let playerToken = '';
  charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

  for (let i = 0; i < length; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    playerToken += charSet.substring(randomPoz, randomPoz + 1);
  }
  return playerToken;
};
