import {Signal, SignalBinding} from "signals";
import {ISignal} from "../../system/Signal/ISignal";
import {AbsDecoratedSignal} from "../../system/Abs/AbsDecoratedSignal";

/**
 *
 */
export class TestServiceMethodSignalContainer {

    public onTestServiceSuccess:TestServiceMethodSignalDecorator = new TestServiceMethodSignalDecorator(new Signal(), this);
    public onTestServiceError:TestServiceMethodSignalDecorator = new TestServiceMethodSignalDecorator(new Signal(), this);
    public onTestServiceEventOne:TestServiceMethodSignalDecorator = new TestServiceMethodSignalDecorator(new Signal(), this);
    public onTestServiceEventTwo:TestServiceMethodSignalDecorator = new TestServiceMethodSignalDecorator(new Signal(), this);

    constructor() {}
}

/**
 *
 */
export class TestServiceMethodSignalDecorator extends AbsDecoratedSignal {
    constructor(decorated_signal:ISignal, container:TestServiceMethodSignalContainer) {
        super(decorated_signal, container);
    }
}