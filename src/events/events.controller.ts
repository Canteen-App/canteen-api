import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

@Controller('events')
export class EventsController {
  constructor(private eventMitter: EventEmitter2) {}

  @Sse('check-new-orders')
  checkNewPaidOrders(): Observable<MessageEvent> {
    return fromEvent(this.eventMitter, 'payment.complete').pipe(
      map((orderDetails) => {
        console.log('Payment: ', orderDetails);
        return { data: orderDetails } as MessageEvent;
      }),
    );
  }

  @Sse('check-items-collected')
  checkItemsCollected(): Observable<MessageEvent> {
    return fromEvent(this.eventMitter, 'items.collected').pipe(
      map((orderDetails) => {
        return { data: orderDetails } as MessageEvent;
      }),
    );
  }
}
