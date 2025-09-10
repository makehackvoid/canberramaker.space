from icalendar import Calendar, Event
import datetime as dt
import zoneinfo

cal = Calendar()

cal.add("prodid", "-//Canberra makerspace//canberramaker.space//EN")
cal.add("version", "1.0")
cal.add("summary", "Canberra makerspace events")


start_date = dt.datetime(2024, 12, 30, tzinfo=zoneinfo.ZoneInfo('Australia/Canberra')) # Start of week 1
end_date = dt.datetime(2025, 12, 31, tzinfo=zoneinfo.ZoneInfo('Australia/Canberra'))
i_date = start_date

agm_event = Event()
agm_date = dt.datetime(2025, 10, 5, tzinfo=zoneinfo.ZoneInfo('Australia/Canberra'))
agm_date += dt.timedelta(hours=13, minutes=00)
agm_event.add("summary", "📢 MHV AGM")
agm_event.add("dtstart", agm_date)
agm_event.add("dtend", agm_date + dt.timedelta(hours=1))

cal.add_component(agm_event)


while i_date <= end_date:
   electronics_wednesday = i_date + dt.timedelta(days=2)
   
   ew_event = Event()
   electronics_wednesday += dt.timedelta(hours=18, minutes=30)
   ew_event.add("summary", "⚡ Electronics Wednesday")
   ew_event.add("dtstart", electronics_wednesday)
   ew_event.add("dtend", 
     electronics_wednesday + dt.timedelta(hours=3))
   cal.add_component(ew_event)

   maker_sunday = i_date + dt.timedelta(days=6)
   maker_sunday += dt.timedelta(hours=13, minutes=00)
   ms_event = Event()
   ms_event.add("summary", "🛠️ Maker Sunday")
   ms_event.add("dtstart", maker_sunday)
   ms_event.add("dtend", 
     maker_sunday + dt.timedelta(hours=3))
   cal.add_component(ms_event)

   i_date = i_date + dt.timedelta(days=7)



with open("mhv.ics", "wb") as f:
    f.write(cal.to_ical())
