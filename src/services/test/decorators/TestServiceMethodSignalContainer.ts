import {Signal, SignalBinding} from "signals";
import {AbsSignal} from "../../system/Signal/AbsSignal";
import {ISignal} from "../../system/Signal/ISignal";

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
export class TestServiceMethodSignalDecorator extends AbsSignal {

    /**
     * If Signal is active and should broadcast events.
     */
    active: boolean;

    /**
     * If Signal should keep record of previously dispatched parameters and automatically
     * execute listener during add()/addOnce() if Signal was already dispatched before.
     */
    memorize: boolean;

    /**
     * Signals Version Number
     */
    VERSION: string;

    private container:TestServiceMethodSignalContainer;

    constructor(decorated_signal:ISignal, container:TestServiceMethodSignalContainer) {
        super(decorated_signal);
        this.decorated_signal = decorated_signal;
        this.container = container;

        this.active = this.decorated_signal.active;
        this.memorize = this.decorated_signal.memorize;
        this.VERSION = this.decorated_signal.VERSION;
    }

    /**
     * Add a listener to the signal.
     *
     * @param listener Signal handler function.
     * @param listenercontext Context on which listener will be executed (object that should represent the
     * `this` variable inside listener function).
     * @param priority The priority level of the event listener. Listeners with higher priority will be executed before
     * listeners with lower priority. Listeners with same priority level will be executed at the same order as they
     * were added. (default = 0)
     */
    public add(listener: Function,
               listenerContext?: any,
               priority?: Number):any {
        this.decorated_signal.add(listener, listenerContext, priority);
        return this.container;
    }

    public addReturn(listener: Function,
                     listenerContext?: any,
                     priority?: Number):SignalBinding {
        return this.decorated_signal.add(listener, listenerContext, priority);
    }

    /**
     * Add listener to the signal that should be removed after first execution (will be executed only once).
     *
     * @param listener Signal handler function.
     * @param listenercontext Context on which listener will be executed (object that should represent the
     * `this` variable inside listener function).
     * @param priority The priority level of the event listener. Listeners with higher priority will be executed before
     * listeners with lower priority. Listeners with same priority level will be executed at the same order as they
     * were added. (default = 0)
     * @param return_container
     */
    public addOnce(listener: Function,
                   listenerContext?: any,
                   priority?: Number):any {
        this.decorated_signal.addOnce(listener, listenerContext, priority);
        return this.container;
    }

    public addOnceReturn(listener: Function,
                   listenerContext?: any,
                   priority?: Number):SignalBinding {
        return this.decorated_signal.addOnce(listener, listenerContext, priority);
    }

    /**
     * Dispatch/Broadcast Signal to all listeners added to the queue.
     *
     * @param params Parameters that should be passed to each handler.
     */
    public dispatch(...params: any[]): any {
        this.decorated_signal.dispatch(params);
        return this.container;
    }

    /**
     * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
     */
    public dispose(): any {
        this.decorated_signal.dispose();
        return this.container;
    }

    /**
     * Forget memorized arguments.
     */
    public forget(): any {
        this.decorated_signal.forget();
        return this.container;
    }

    /**
     * Returns a number of listeners attached to the Signal.
     */
    public getNumListeners(): any {
        this.decorated_signal.getNumListeners();
        return this.container;
    }

    /**
     * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
     */
    public halt(): any {
        this.decorated_signal.halt();
        return this.container;
    }

    /**
     * Check if listener was attached to Signal.
     *
     * @param return_container
     */
    public has(listener: Function,
               context?: any):any {
        this.decorated_signal.has(listener, context);
        return this.container;
    }

    public hasReturn(listener: Function,
                     context?: any):boolean {
        return this.decorated_signal.has(listener, context);
    }

    /**
     * Remove a single listener from the dispatch queue.
     *
     * @param return_container
     */
    public remove(listener: Function, context?: any):any {
        this.decorated_signal.remove(listener, context);
        return this.container;
    }

    public removeReturn(listener: Function, context?: any):Function {
        return this.decorated_signal.remove(listener, context);
    }

    public removeAll(): any {
        this.decorated_signal.removeAll();
        return this.container;
    }
}