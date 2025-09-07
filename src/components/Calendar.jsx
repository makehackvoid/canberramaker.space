import { createSignal, createMemo, onMount } from "solid-js";

import { createStore } from "solid-js/store";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

import "./Calendar.css";

export default (props) => {
  let calendarDom;
  let calendar = null;

  const [view, setView] = createSignal("month");

  const [dateRange, setDateRange] = createStore({ start: null, end: null });

  const renderRangeText = () => {
    if (dateRange.start) {
      let startDate = dayjs(calendar.renderRange.start.d);
      let endDate = dayjs(calendar.renderRange.end.d);
      if (view() == "month") {
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

  onMount(() => {
    dayjs.extend(advancedFormat);
    calendar = new Calendar(calendarDom, {
      defaultView: "month",
      template: {
        time(event) {
          const { start, end, title } = event;

          return `<span style="color: white;">${formatTime(start)}~${formatTime(end)} ${title}</span>`;
        },
        allday(event) {
          return `<span style="color: gray;">${event.title}</span>`;
        },
      },
      week: {
        taskView: false,
      },
      calendars: [
        {
          id: "cal1",
          name: "Personal",
          backgroundColor: "#03bd9e",
        },
        {
          id: "cal2",
          name: "ACT Public Holidays",
          backgroundColor: "#00a9ff",
        },
      ],
    });
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
            <button onClick={[nextHandler]}>Next</button>

            <select value={view()} onInput={viewHandler}>
              <option value="month">Month</option>
              <option value="two-weeks">Two weeks</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
        <div class="calendar-pane">
          <div ref={calendarDom} style="height:100%;"></div>
        </div>
      </div>
    </>
  );
};
