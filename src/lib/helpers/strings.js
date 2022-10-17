export const getS = (value) => {
  if (typeof value === 'number') {
    if (value === 1) {
      return '';
    } else {
      return 's';
    }
  }
}