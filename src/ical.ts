interface Event {
  id: string;
  summary: string;
  timestamp: string;
  timeStart: string;
  timeEnd: string;
}

export class ICal {
  events: Event[] = [];

  constructor(public name: string = '') {
  }

  private uuid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private toTimestamp(date: Date | number) {
    let str = new Date(+date).toISOString();
    str = str.split('.')[0];
    str = str.replace(/[:-]/g, '');
    return str + 'Z';
  }

  addEvent(startTime: Date, name: string) {
    this.events.push({
      id: this.uuid(),
      timestamp: this.toTimestamp(new Date()),
      timeStart: this.toTimestamp(startTime),
      timeEnd: this.toTimestamp(+startTime + 60_000),
      summary: name,
    })
  }

  toString() {
    let str = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    str += "PRODID:-//ramazan-times.web.app//ramazan-times-generator//EN\n"
    str += `NAME:${this.name}\n`;
    str += `X-WR-CALNAME:${this.name}\n`;

    for (let event of this.events) {
      str += `
BEGIN:VEVENT
UID:${event.id}
SEQUENCE:0
DTSTAMP:${event.timestamp}
DTSTART:${event.timeStart}
DTEND:${event.timeEnd}
SUMMARY:${event.summary}
END:VEVENT
`
    }

    str += "END:VCALENDAR";
    return str;
  }

  download() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.toString()));
    element.setAttribute('download', this.name + '.ics');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
