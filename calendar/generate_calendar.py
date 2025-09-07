import icalendar
from pathlib import Path

pub_hols_path = Path("./public-holiday-ical-feed.ics")

calendar = icalendar.Calendar.from_ical(ics_path.read_bytes())
