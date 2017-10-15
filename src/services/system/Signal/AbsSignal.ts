import {SignalBinding} from "signals";
import {ISignal} from "./ISignal";

export abstract class AbsSignal implements ISignal {

    protected decorated_signal:ISignal;

    constructor(decorated_signal:ISignal) {
        this.decorated_signal = decorated_signal;
    }

    /**
     * If Signal is active and should broadcast events.
     */
    public active: boolean;

    /**
     * If Signal should keep record of previously dispatched parameters and automatically
     * execute listener during add()/addOnce() if Signal was already dispatched before.
     */
    public memorize: boolean;

    /**
     * Signals Version Number
     */
    public VERSION: string;

    /**
     * Add a listener to the signal.
     *
     * @param listener Signal handler function.
     * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param priority The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     */
    public add(listener: Function, listenerContext?: any, priority?: Number): SignalBinding {
        return this.decorated_signal.add(listener, listenerContext, priority);
    };

    /**
     * Add listener to the signal that should be removed after first execution (will be executed only once).
     *
     * @param listener Signal handler function.
     * @param listenercontext Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param priority The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
     */
    public addOnce(listener: Function, listenerContext?: any, priority?: Number): SignalBinding {
        return this.decorated_signal.addOnce(listener, listenerContext, priority);
    }

    /**
     * Dispatch/Broadcast Signal to all listeners added to the queue.
     *
     * @param params Parameters that should be passed to each handler.
     */
    public dispatch(...params: any[]): void {
        this.decorated_signal.dispatch(params);
    }

    /**
     * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
     */
    public dispose(): void {
        this.decorated_signal.dispose();
    }

    /**
     * Forget memorized arguments.
     */
    public forget(): void {
        this.decorated_signal.forget();
    }

    /**
     * Returns a number of listeners attached to the Signal.
     */
    public getNumListeners(): number {
        return this.decorated_signal.getNumListeners();
    }

    /**
     * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
     */
    public halt(): void {
        this.decorated_signal.halt();
    }

    /**
     * Check if listener was attached to Signal.
     */
    public has(listener: Function, context?: any): boolean {
        return this.decorated_signal.has(listener, context);
    }

    /**
     * Remove a single listener from the dispatch queue.
     */
    public remove(listener: Function, context?: any): Function {
        return this.decorated_signal.remove(listener, context);
    }

    public removeAll(): void {
        this.decorated_signal.removeAll();
    }

}