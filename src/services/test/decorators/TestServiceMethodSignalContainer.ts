import {Signal} from "signals";
import {ISignal} from "../../system/Signal/ISignal";
import {AbsDecoratedSignal} from "../../system/Abs/AbsDecoratedSignal";

/**
 *
 */
export class TestServiceMethodSignalContainer {

    public onTestServiceSuccess:TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer> =
        new TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer>(new Signal(), this);

    public onTestServiceError:TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer> =
        new TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer>(new Signal(), this);

    public onTestServiceEventOne:TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer> =
        new TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer>(new Signal(), this);

    public onTestServiceEventTwo:TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer> =
        new TestServiceMethodSignalDecorator<TestServiceMethodSignalContainer>(new Signal(), this);

    constructor() {}
}

/**
 *
 */
export class TestServiceMethodSignalDecorator<T> extends AbsDecoratedSignal<T> {
    constructor(decorated_signal:ISignal, container:T) {
        super(decorated_signal, container);
    }
}