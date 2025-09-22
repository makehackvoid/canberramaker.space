import { createSignal, createMemo, onMount } from "solid-js";

import { createStore } from "solid-js/store";

import ICAL from "ical.js";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { v4 as uuidv4 } from "uuid";
import "./Schedule.css";

import pubHolsURL from "/calendars/act.ics?url";
import mhvCalendarURL from "/calendars/mhv.ics?url";

import {
  createCalendar,
  createViewMonthGrid,
  createViewList,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "temporal-polyfill/global";

// https://schedule-x.dev/docs/calendar

export default (props) => {
  let calendarDom;

  async function streamToString(stream) {
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let result = "";

    async function read() {
      const { done, value } = await reader.read();

      if (done) {
        return result;
      }

      result += textDecoder.decode(value, { stream: true });
      return read();
    }

    return read();
  }

  async function generateEvents(url, calId, isAllday = false) {
    const response = await fetch(url);
    if (response.ok) {
      const strCalendar = await streamToString(response.body);
      const jcal = ICAL.parse(strCalendar);

      const events = parseVEvents(jcal);

      for (const i in events) {
        events[i]["id"] = uuidv4();
        events[i]["start"] = events[i]["dtstart"];
        events[i]["end"] = events[i]["dtend"];
        if (isAllday) {
          events[i]["isAllday"] = true;
          events[i]["end"] = events[i]["start"];
        }
        events[i]["calendarId"] = calId;
        events[i]["title"] = events[i]["summary"];
      }

      return events;
    }
  }

  function parseVEvents(jcal) {
    let events = [];
    for (const i in jcal) {
      if (jcal[i] instanceof Array) {
        for (const j in jcal[i]) {
          console.log(jcal[i][j][0]);
          if (jcal[i][j][0] == "vevent") {
            let event = {};
            for (const k in jcal[i][j][1]) {
              let vEvent = jcal[i][j][1][k];
              event[vEvent[0]] = vEvent[3];
            }
            events.push(event);
          }
        }
      }
    }
    return events;
  }

  onMount(async () => {
    const pubHolsEvents = await generateEvents(pubHolsURL, "pubHols", true);
    const mhvEvents = await generateEvents(mhvCalendarURL, "mhv");

    for (const i in pubHolsEvents) {
      let start = Temporal.PlainDate.from(pubHolsEvents[i]["start"]);
      let end = Temporal.PlainDate.from(pubHolsEvents[i]["end"]);

      pubHolsEvents[i]["start"] = start;
      pubHolsEvents[i]["end"] = end;
    }

    let calendar = createCalendar({
      views: [createViewMonthGrid(), createViewList()],
      events: pubHolsEvents,
    });

    calendar.render(calendarDom);
  });

  return (
    <>
      <div class="schedule-display container">
        <div class="calendar-pane">
          <div ref={calendarDom} style="height:100%;"></div>
        </div>
        <div class="calendar-feeds">
          <span class="mvh">
            📅
            <a href="/calendars/mhv.ics">MHV Calendar (iCalendar feed)</a>
          </span>
          <span class="canberra">
            📅
            <a href="/calendars/act.ics">
              ACT Public Holidays (iCalendar feed)
            </a>
          </span>
        </div>
      </div>
    </>
  );
};
