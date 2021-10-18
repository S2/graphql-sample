const { ApolloServer, gql } = require('apollo-server');
const express = require('express');
const cors = require('cors');

const mysql = require('mysql2/promise');
// create table books ( id int auto_increment primary key , title varchar(255) NOT NULL , author varchar(255) not null);
// mysql> insert into books ( title,author) values ("title1","author1"),("title2","author2");
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Books {
    count: Int,
    rows: [Book]
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: Books
  }
`;

const main = async ()=>{
  const resolvers = {
    Query: {
      books: async () => {
        // const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);
        // const [books] = await connection.execute('SELECT * FROM `books`');
        const [books] = await connection.execute('SELECT * FROM books LIMIT 10');
        const [[{count}]] = await connection.execute('SELECT count(*) AS count FROM books');

        return {
          count, 
          rows: books
        }
      },
    },
  };

  const corsOptions = {
    origin: 'http://localhost',
    credentials: true
  }
  
  const server = new ApolloServer({ 
    typeDefs, resolvers , 
    cors: corsOptions, 
  });

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '',
    database: 'guncys'
  })

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  })
}
main()

