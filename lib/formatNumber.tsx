export default function (value: number, allowWholeNumbers?: boolean) {
  const options = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  // // if its a whole, dollar amount, leave off the .00
  if (allowWholeNumbers) {
    if (value % 100 === 0) options.minimumFractionDigits = 0;
  }
  const formattedNumber = (value / 100).toLocaleString('en-US', options);
  return formattedNumber;
}
