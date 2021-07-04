import { Observable, Subject } from "rxjs";
import { stringifyFn } from "./json-fn";

export class SmartWorker{
    private _worker : Worker | undefined;
    private _logicFunc : any | undefined;
    private _logicFuncArguments : any[] | undefined;
    private _isWorking : boolean = false;
    private _resultNotifier$ : Subject<any> | undefined;

    constructor(logicFunc : any, logicFuncArguments : any[]){
        if (logicFunc){
            this._worker = new Worker('./ng-rxjs-worker.js', { type: 'module' });
            this._logicFunc = logicFunc;
            this._logicFuncArguments = (logicFuncArguments) ? logicFuncArguments : undefined;
            this._resultNotifier$ = new Subject<any>();
        }else{
            throw new Error('SmartWorkers logic function is undefined!');
        }
    }

    /**
     * Handler invoked, when web worker sends message
     * @param res payload
     */
    private onWorkerMsg(res : any){
        this._resultNotifier$!.next(res.data);
        this._isWorking = false;
    }

    /**
     * Starts web worker
     * @returns 
     */
    public run() : Observable<any>
    {
        if (this._worker && !this._isWorking){
            this._isWorking = true;
            this._worker.postMessage({
                func : stringifyFn(this._logicFunc),
                payload : this._logicFuncArguments
            });

            // response handler, web worker sends msg
            this._worker.onmessage = (e)=>{
                this.onWorkerMsg(e);
            }        
        }else{
            console.error("Error: Cannot run busy SmartWorker!");
        }
        return this._resultNotifier$!.asObservable();
    }

    /**
     * Terminates worker
     */
    public abort(){
        this._worker?.terminate();
        this._isWorking = false;
    }

    /**
     * Deletes worker
     */
    public delete(){
        this._worker?.terminate();
        this._worker = undefined;
        this._logicFunc = undefined;
        this._logicFuncArguments = undefined;
        this._resultNotifier$ = undefined;
        this._isWorking = false;
    }
}
