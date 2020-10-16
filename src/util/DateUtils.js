export function getLastTwoWeekDays() {
  const date = new Date();
  const result = [];
  for (let i = 0; i < 14; i++) {
    date.setDate(date.getDate() - 1);
    result.push(`${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`);
  }
  return result;
}

function padTwo(number) {
  if (String(number).length < 2) {
    return `0${number}`;
  }
  return number;
}
