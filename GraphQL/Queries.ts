import {QueryRow , QueryRowSingle , QueryArguments , ChildrenQueryArguments} from '../GraphQL'

// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
// 
//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }
// 
//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;


interface InterfaceAdmin extends QueryArguments{
    author? : string
    title? : string
}
export class Books extends QueryRow<InterfaceAdmin>{
    constructor(queryArguments , getColumns , successCallback = (row?)=>{}){
        super('books' , queryArguments , getColumns , successCallback)
    }

    getAllColumns(){
        return ['title' , "author"]
    }

    hasSortOrder(){
        return false
    }
}

export class Book extends QueryRowSingle<InterfaceAdmin>{
    constructor(queryArguments , getColumns , successCallback = (row?)=>{}){
        super('book' , queryArguments , getColumns , successCallback)
    }

    getAllColumns(){
        return ['title' , "author"]
    }

    hasSortOrder(){
        return false
    }
}

