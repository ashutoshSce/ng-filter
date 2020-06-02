import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export function debounce(debounceTimeInSeconds: number) {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    const method = descriptor.value;
    const destroyLifecycle = target.ngOnDestroy;

    const subj = new Subject();
    const subscriber = subj.pipe(
      debounceTime(debounceTimeInSeconds),
      distinctUntilChanged()
    ).subscribe((val: any) => method.apply(val.that, val.args));

    target.ngOnDestroy = function (args) {
      subscriber.unsubscribe();
      if (destroyLifecycle) {
        destroyLifecycle.apply(target, args);
      }
    };

    descriptor.value = function () {
      subj.next({ that: this, args: arguments });
    };
  };
}
