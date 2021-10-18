import {Query , Mutation} from "../GraphQL"

export class UserQuery extends Query {
    constructor(queryName , queryArguments , getColumns , successCallback = ()=>{} , failedCallback = ()=>{}){
        super(queryName , queryArguments , getColumns , successCallback , failedCallback)
    }
}

export class UserMutation extends Mutation {
    constructor(queryName , queryArguments , getColumns , successCallback = ()=>{} , failedCallback = ()=>{}){
        super(queryName , queryArguments , getColumns , successCallback , failedCallback)
    }
}

