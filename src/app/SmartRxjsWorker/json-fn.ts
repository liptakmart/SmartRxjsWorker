
export function stringifyFn(obj: any) {
    return JSON.stringify(obj, function (key, value) {
        var fnBody;
        if (value instanceof Function || typeof value == 'function') {

            fnBody = value.toString();

            if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
                return '_NuFrRa_' + fnBody;
            }
            return fnBody;
        }
        if (value instanceof RegExp) {
            return '_PxEgEr_' + value;
        }
        return value;
    });
}

export function parseFn(str : any, date2obj : any) {
    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

    return JSON.parse(str, function (key, value) {
        var prefix;

        if (typeof value != 'string') {
            return value;
        }
        if (value.length < 8) {
            return value;
        }

        prefix = value.substring(0, 8);

        if (iso8061 && value.match(iso8061 as any)) {
            return new Date(value);
        }
        if (prefix === 'function') {
            return eval('(' + value + ')');
        }
        if (prefix === '_PxEgEr_') {
            return eval(value.slice(8));
        }
        if (prefix === '_NuFrRa_') {
            if(value[8] == '('){
                return eval(value.slice(8));
            }else{
                // ts function
                let paramIdxStart : number = -1;
                let paramIdxEnd : number = -1;
                let paramFound : boolean = false;

                for (let i = 8; i < value.length; i++) {
                    if (value[i] == '('){
                        paramIdxStart = i;
                        paramFound = true;
                        continue;
                    }

                    if (paramFound){
                        if (value[i] == ')'){
                            paramIdxEnd = i;

                            let fnStr : string = value.slice(paramIdxStart, paramIdxEnd+1) + '=>' + value.slice(paramIdxEnd+1);
                            return eval(fnStr);
                        }
                    }
                }
            }   
        }

        return value;
    });
}