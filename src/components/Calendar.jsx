import { createSignal, createMemo, onMount } from "solid-js";

import { createStore } from "solid-js/store";

import ICAL from "ical.js";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

import { v4 as uuidv4 } from "uuid";
import "./Calendar.css";

import pubHolsURL from "/calendars/act.ics?url";
import mhvCalendarURL from "/calendars/mhv.ics?url";

// https://schedule-x.dev/docs/calendar

export default (props) => {
  let calendarDom;
  let calendar = null;

  const [view, setView] = createSignal("month");

  const [dateRange, setDateRange] = createStore({ start: null, end: null });

  const renderRangeText = () => {
    if (dateRange.start) {
      let startDate = dayjs(calendar.renderRange.start.d);
      let endDate = dayjs(calendar.renderRange.end.d);
      if (view() == "month" || view() == "week") {
        let diffDays = endDate.diff(startDate, "days");
        let middleDiff = Math.floor(diffDays / 2);

        let middleDate = startDate.add(middleDiff, "day").toDate();

        const month = middleDate.toLocaleString("default", { month: "long" });
        const year = middleDate.getFullYear();

        return `${month} ${year}`;
      } else if (view() == "day") {
        return startDate.format("dddd, Do MMMM YYYY");
      }
    }
    return "somehting else";
  };

  const nextHandler = (event) => {
    calendar.next();
    setDateRange(calendar.renderRange);
  };

  const prevHandler = (event) => {
    calendar.prev();
    setDateRange(calendar.renderRange);
  };

  const todayHandler = (event) => {
    calendar.today();
    setDateRange(calendar.renderRange);
  };

  const viewHandler = (event) => {
    let value = event.currentTarget.value;
    if (value == "two-weeks") {
      value = "month";
      calendar.setOptions({
        month: {
          visibleWeeksCount: 2,
        },
      });
    } else if (value == "month") {
      calendar.setOptions({
        month: {
          visibleWeeksCount: 6,
        },
      });
    }
    setView(value);
    calendar.changeView(view());

    setDateRange(calendar.renderRange);
  };

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

    console.log("mvh", mhvEvents);

    dayjs.extend(advancedFormat);
    calendar = new Calendar(calendarDom, {
      defaultView: view(),
      template: {
        time(event) {
          const { start, end, title } = event;
          if (event.isAllday) {
            return `<span>${title}</span>`;
          } else {
            return `
              <span>${title}</span>
            `;
          }
          console.log("time", event);
        },
        allday(event) {
          return `<span>${title}</span>`;
        },
      },
      week: {
        taskView: false,
      },
      calendars: [
        {
          id: "mhv",
          name: "MHV",
          backgroundColor: "#03bd9e",
        },
        {
          id: "pubHols",
          name: "ACT Public Holidays",
          backgroundColor: "#00a9ff",
        },
      ],
    });

    calendar.createEvents(pubHolsEvents);
    calendar.createEvents(mhvEvents);

    setDateRange(calendar.renderRange);

    let startDate = dayjs(calendar.renderRange.start.d);
    let endDate = dayjs(calendar.renderRange.end.d);

    let diffDays = endDate.diff(startDate, "days");
  });

  return (
    <>
      <div class="calendar-display container">
        <div class="navigation">
          <span class="range-title">{renderRangeText()}</span>
          <div class="controls">
            <button onClick={[todayHandler]}>Today</button>
            <button onClick={[prevHandler]}>Previous</button>
            <label>
              View:
              <select value={view()} onInput={viewHandler}>
                <option value="month">Month</option>
                <option value="two-weeks">Two weeks</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </label>
            <button onClick={[nextHandler]}>Next</button>
          </div>
        </div>
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
