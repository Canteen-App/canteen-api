import { Controller, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, Subject, fromEvent, map } from 'rxjs';

@Controller('events')
export class EventsController {
  private itemsCollectedSubject: Subject<any> = new Subject<any>();

  constructor(private eventEmitter: EventEmitter2) {
    // Subscribe to events emitted outside the transaction
    this.eventEmitter.on('items.collected', (data) => {
      this.itemsCollectedSubject.next(data);
    });
  }

  // SSE endpoint for Ordering App plus Order Management System to subscribe to updates for items collected
  @Sse('check-items-collected')
  checkItemsCollected(): Observable<MessageEvent> {
    return this.itemsCollectedSubject.asObservable().pipe(
      map((orderDetails) => {
        return { data: orderDetails } as MessageEvent;
      }),
    );
  }

  // Only to be connected from Order Management System
  @Sse('check-new-orders')
  checkNewPaidOrders(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'payment.complete').pipe(
      map((orderDetails) => {
        console.log('Payment: ', orderDetails);
        return { data: orderDetails } as MessageEvent;
      }),
    );
  }
}
