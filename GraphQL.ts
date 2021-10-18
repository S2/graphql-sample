import url from "./GraphQL/Url"

class ResultRows<T>{
    hasName = true
    hasId = true
    byNameHash = {}
    byIdHash = {}
    constructor(private rows: Array<T>, public allRowsCount = 0) {
        rows.forEach((row) => {
            let keys = {}
            Object.keys(row).forEach((key) => {
                keys[key] = true
            })
            this.hasName = this.hasName && keys["name"]
            this.hasId = this.hasId && keys["id"]
            this.byNameHash[row["name"]] = row
            this.byIdHash[row["id"]] = row
        })
    }

    public get(index) {
        return this.rows[index]
    }

    get length(){
        return this.rows.length
    }

    public map(cb) {
        return this.rows.map(cb)
    }
    public forEach(cb) {
        return this.rows.forEach(cb)
    }

    public filter(cb) {
        return this.rows.filter(cb)
    }

    public unshift(row) {
        return this.rows.unshift(row)
    }

    public push(row) {
        return this.rows.push(row)
    }

    public pop() {
        return this.rows.pop()
    }

    public shift() {
        return this.rows.shift()
    }

    getByName(name) {
        if (!this.hasName) {
            throw("not have name")
        }
        return this.byNameHash[name]
    }

    getById(id) {
        if (!this.hasId) {
            throw("not have id")
        }

        return this.byIdHash[id]
    }
}

export class Client {
    createQuery(queries) {
        return `{"query" : "{${queries.map(query => {
            return query.getQuery()
        }).join(",")}}"}`
    }

    call(queries, failedCallback = (result?) => {
    }, successCallback = (result?) => {
    }) {
        const body = this.createQuery(queries);
        const method = "POST";
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        return fetch(url, {
            mode: 'cors', 
            credentials: 'include' , 
            body, method, headers
        }).then(response => {
            return response.json()
        }).then(result => {
            const resultRowObjects = {};
            const maxRowCounts = {};
            queries.forEach((query) => {
                if (result["data"] && result["data"][query.queryName] && result["data"][query.queryName]["errors"]) {
                    failedCallback(result);
                    return
                }
                if (result["errors"]) {
                    failedCallback(result);
                    return
                }
                if (result["error"]) {
                    failedCallback(result);
                    return
                }
                if (query instanceof QueryRow) {
                    const rowObject = new ResultRows(result["data"][query.queryName]["rows"], result["data"][query.queryName]["count"])
                    resultRowObjects[query.queryName] = rowObject;
                    query.successCallback(rowObject, result["data"][query.queryName]["count"])
                } else {
                    resultRowObjects[query.queryName] = result["data"][query.queryName];
                    query.successCallback(result["data"][query.queryName])
                }
            });
            return Promise.resolve(resultRowObjects);
        })
    }
}

export class Query extends Client {
    constructor(queryName, queryArguments, getColumns, successCallback = (result?) => {
    }, failedCallback = (result?) => {
    }) {
        super()
        getColumns = getColumns.map((column) => {
            if (column instanceof Object) {
                return `${column.name}{${column.children.join(",")}}`
            } else {
                return column
            }
        })
        let query = `{"query" : " {${queryName}(${JSON.stringify(queryArguments).replace(/\{|}$/g, "").replace(/"([^"]*?)":/g, (arg1, arg2) => {
            return arg2 + ":"
        }).replace(/"/g, '\\"')}){${getColumns.join(",")}}}"}`
    }
}

export interface QueryArguments {
    all?
    id?
    page?
    limit?
    order?
}

export interface ChildrenQueryArguments<T extends {}> {
    name: string
    children: Array<keyof T>
}

export abstract class QueryRow<T extends QueryArguments, K extends {} = {}> {
    constructor(public queryName, private queryArguments: T, private getColumns: Array<ChildrenQueryArguments<K> | keyof T>, public successCallback = (row: ResultRows<T & K>, count?: number) => {
    }) {
    }

    getQuery() {
        let hasAll = false
        let getColumns = this.getColumns.map((column) => {
            if (column instanceof Object) {
                return `${(column as ChildrenQueryArguments<K>).name}{${(column as ChildrenQueryArguments<K>).children.join(",")}}`
            } else {
                if (column == "all") {
                    hasAll = true
                }
                return column
            }
        })
        if (hasAll) {
            getColumns = getColumns.filter(column => column != "all")
            getColumns.push(...this.getAllColumns())
            getColumns.push("id")
        }
        if (this.hasSortOrder() && !this.queryArguments["order"]) {
            this.queryArguments["order"] = "sort_order ASC"
        }
        let s = `${this.queryName}(${JSON.stringify(this.queryArguments).replace(/\{|}$/g, "").replace(/"([^"]*?)":/g, (arg1, arg2) => {
            return arg2 + ":"
        }).replace(/"/g, '\\"')}){count , rows{${getColumns.join(",")}}}`
        s = s.replace(/\(\)/,"")
        return s;
    }

    abstract getAllColumns()

    abstract hasSortOrder()
}

export abstract class QueryRowSingle<T extends QueryArguments, K extends {} = {}> {
    constructor(public queryName, private queryArguments: T, private getColumns: Array<ChildrenQueryArguments<K> | keyof T>, public successCallback = (row: T & K) => {
    }) {
    }

    getQuery() {
        let hasAll = false
        let getColumns = this.getColumns.map((column) => {
            if (column instanceof Object) {
                return `${(column as ChildrenQueryArguments<K>).name}{${(column as ChildrenQueryArguments<K>).children.join(",")}}`
            } else {
                if (column == "all") {
                    hasAll = true
                }
                return column
            }
        })
        if (hasAll) {
            getColumns = this.getAllColumns()
            getColumns.push("id")
        }
        return `${this.queryName}(${JSON.stringify(this.queryArguments).replace(/\{|}$/g, "").replace(/"([^"]*?)":/g, (arg1, arg2) => {
            return arg2 + ":"
        }).replace(/"/g, '\\"')}){${getColumns.join(",")}}`
    }

    abstract getAllColumns()

    abstract hasSortOrder()
}

export function multipleQuery(failedCallback, ...queries) {
    return new Client().call(queries.filter(query => !!query), failedCallback)
}

export class Mutation extends Client {
    constructor(private queryName, private queryArguments, private getColumns, public successCallback = (result?) => {
    }, failedCallback = (result?) => {
    }) {
        super()
        getColumns.push("errors")
        this.call([this], failedCallback)
    }

    createQuery() {
        return `{"query" : "mutation{${this.queryName} ( input: ${JSON.stringify(this.queryArguments).replace(/"([^"]*?)":/g, (arg1, arg2) => {
            return arg2 + ":"
        }).replace(/"/g, '\\"')} ){${this.getColumns.join(",")} } }"}`
    }
}

class MutationForAsync extends Client {
    constructor(private queryName, private queryArguments, private getColumns, public successCallback = (result?) => {
    }, failedCallback = (result?) => {
    }) {
        super()
    }

    createQuery() {
        return `{"query" : "mutation{${this.queryName} ( input: ${JSON.stringify(this.queryArguments).replace(/"([^"]*?)":/g, (arg1, arg2) => {
            return arg2 + ":"
        }).replace(/"/g, '\\"')} ){${this.getColumns.join(",")} } }"}`
    }
}

export function mutation(queryName, queryArguments, getColumns, successCallback = (result?) => {
}, failedCallback = (result?) => {
}) {
    getColumns.push("errors")
    const mutation = new MutationForAsync(queryName, queryArguments, getColumns, successCallback, failedCallback)
    mutation.call([mutation], failedCallback)
}

