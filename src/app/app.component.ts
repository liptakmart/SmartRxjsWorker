import { Component } from '@angular/core';
import { SmartWorker } from './SmartRxjsWorker/smart-rxjs-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SmartRxjsWorker';

  public work() {
    if (window.Worker) {
      let smWorker01: SmartWorker = new SmartWorker(this.sum, [1, 999999999]);
      smWorker01.run().subscribe(r => {
        console.log("subs: ", r);
      });
    }
  }

  sum(startIdx: number, endIdx: number): number {
    let sum: number = 0;
    for (let i = startIdx; i < endIdx; i++) {
      sum += i;
    }
    return sum;
  }
}
