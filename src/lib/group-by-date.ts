import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

dayjs.extend(updateLocale);
dayjs.extend(isToday);

dayjs.extend(relativeTime, {
  thresholds: [
    // { l: 's', r: 1 },
    // { l: 'm', r: 1 },
    // { l: 'mm', r: 59, d: 'minute' },
    // { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
});

dayjs.updateLocale('zh-cn', {
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    w: '1 周',
    ww: '%d 周',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年',
  },
});

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    w: '%d week',
    ww: '%d weeks',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

const todayString = dayjs.locale() === 'zh-cn' ? '今天' : 'Today';

export function groupByTimeFromNow<T extends { created_at: string }>(
  items: T[],
) {
  // then group by time from now
  // return a list of { time: "", items: []}
  const result: { time: string; items: T[] }[] = [];

  items.forEach((item) => {
    const date = dayjs(item.created_at);
    if (date.isToday()) {
      const index = result.findIndex((r) => r.time === todayString);
      if (index === -1) {
        result.push({ time: todayString, items: [item] });
      } else {
        result[index].items.push(item);
      }
      return;
    }

    const timeFromNow = date.fromNow();
    const index = result.findIndex((r) => r.time === timeFromNow);
    if (index === -1) {
      result.push({ time: timeFromNow, items: [item] });
    } else {
      result[index].items.push(item);
    }
  });

  return result;
}
