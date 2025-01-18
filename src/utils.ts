export function formatDate(date?: Date): string {
  if (!date) return "";
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export function getNextNextMonthFirstDayDate(): Date {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 2; // 获取下下个月
  // 如果月份超过12月，则年份增加1，月份减去12
  if (month > 11) {
    year += 1;
    month -= 12;
  }
  // 设置日期为下下个月的1号
  const firstDay = new Date(year, month, 1);
  return firstDay;
}

export function getDateMinus90DaysDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 90); // 当前日期减去90天
  return date;
}

export function getFirstDayOfPreviousMonth(monthsAgo: number): Date {
  const now = new Date();
  now.setMonth(now.getMonth() - monthsAgo);
  now.setDate(1); // 设置为该月的第一天
  return now;
}

export function getJapanDate(date?: Date): string {
  if (!date) return "";
  date = new Date(date);
  date.setHours(date.getHours() + 9); // 转换为日本标准时间（JST）
  return date.toISOString().slice(0, 10).replace(/-/g, "/"); // 格式化为 yyyy/mm/dd
}
