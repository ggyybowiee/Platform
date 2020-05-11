import { Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface RxEvent {
  type: string,
  value: any,
}

class RxEventBus {
  subject: Subject<RxEvent>
  eventsDesc: object

  constructor() {
    this.subject = new Subject();
    this.eventsDesc = {};
  }

  subscribe(type: string, action: (any) => any) {
    return this.subject
      .pipe(
        filter(event => event.type === type),
        map(event => event.value)
      )
      .subscribe(action);
  }

  emmit(event: RxEvent) {
    this.subject.next(event);
  }

  registerEventType(type: string, desc: string) {
    this.eventsDesc[type] = desc;
  }

}

export default new RxEventBus();

