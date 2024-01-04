import { performance } from "node:perf_hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import config from "../config.json" assert { type: "json" };
import { log } from "./app.js";

dayjs.extend(utc);
dayjs.extend(tz);


/**
 * Check if today is a public holiday in Slovenia.
 * @param {dayjs.Dayjs} nowInSlovenia
 * @returns
 */
async function isTodayPublicHoliday(nowInSlovenia) {
  const utcOffset = Math.floor(nowInSlovenia.utcOffset() / 60);
  log.info(`UTC offset: ${utcOffset}`);
  const url = `https://date.nager.at/api/v3/IsTodayPublicHoliday/SI?offset=${utcOffset}`;
  const response = await fetch(url);
  log.info(`IsTodayPublicHoliday Response status: ${response.status}`);
  switch (response.status) {
    case 200:
      return true;
    case 204:
      return false;
    default:
      log.error(`Unexpected response status: ${response.status} when determining if today is a public holiday.`);
      throw new Error(
        `Unexpected response status: ${response.status} when determining if today is a public holiday.`
      );
  }
}

/**
 * @param {dayjs.Dayjs} nowInSlovenia
 * @param {boolean} isWorkingDay
 */
async function getBlock(nowInSlovenia, isWorkingDay) {
  const currentMonth = nowInSlovenia.month() + 1;
  const season = config.season.hi_season.includes(currentMonth)
    ? "hi_season"
    : "low_season";

  performance.mark(`isTodayPublicHolidayStart`);
  const isPublicHoliday = await isTodayPublicHoliday(nowInSlovenia);
  performance.mark(`isTodayPublicHolidayEnd`);
  performance.measure(`isTodayPublicHoliday`, `isTodayPublicHolidayStart`, `isTodayPublicHolidayEnd`);
  log.debug(`isPublicHoliday measure: ${performance.getEntriesByName("isTodayPublicHoliday")[0].duration}`);
  const blockKey = isPublicHoliday || !isWorkingDay ? "weekend" : "work_day";
  log.info(`Season: ${season}, blockKey: ${blockKey}`);

  const block = config.blocks[season][blockKey][nowInSlovenia.hour()];
  return block;
}

/**
 * @param {string} provider
 */
export async function getPrice(provider) {
  log.info(`Getting price for ${provider}`)
  const nowInSlovenia = dayjs().tz("Europe/Ljubljana");
  const dayOfWeek = nowInSlovenia.day();
  const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
  log.info(`Now in Slovenia: ${nowInSlovenia.format()}, isWorkingDay: ${isWorkingDay}`)

  performance.mark(`getBlockStart-${provider}`);
  const block = await getBlock(nowInSlovenia, isWorkingDay);
  performance.mark(`getBlockEnd-${provider}`);
  performance.measure(`getBlock-${provider}`, `getBlockStart-${provider}`, `getBlockEnd-${provider}`);
  log.debug(`getBlock measure: ${performance.getEntriesByName(`getBlock-${provider}`)[0].duration}`);
  return `${provider} -> B${block}`;
}
