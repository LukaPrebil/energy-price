import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import config from "../config.json" assert { type: "json" };

dayjs.extend(utc);
dayjs.extend(tz);

function getBlock() {
  const nowInSlovenia = dayjs().tz("Europe/Ljubljana");
  const currentMonth = nowInSlovenia.month() + 1;
  const season = config.season.hi_season.includes(currentMonth)
    ? "hi_season"
    : "low_season";

  const block = config.blocks[season].work_day[nowInSlovenia.hour()];
  return block;
}

/**
 * @param {string} provider
 */
export async function getPrice(provider) {
  const block = getBlock();

  return `B${block}`;
}
