import { createSignal, onMount } from "solid-js";

import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

export default (props) => {
  let calendarDom;
  let calendar;

  const [view, setView] = createSignal({});

  onMount(() => {
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
      calendars: [
        {
          id: "cal1",
          name: "Personal",
          backgroundColor: "#03bd9e",
        },
        {
          id: "cal2",
          name: "Work",
          backgroundColor: "#00a9ff",
        },
      ],
    });
  });

  return (
    <>
      <div ref={calendarDom} style="height:100%;"></div>
    </>
  );
};
