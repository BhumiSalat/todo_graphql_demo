var express = require("express");
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// //dinner_program
// const { GraphQLServer } = require("graphql-yoga");

// const dinnerOptions = ["🍕", "🌭", "🍔", "🥗", "🍣"];

// const typeDefs = `
//   type Query {
//     whatsForDinner: String!
//   }
// `;

// const resolvers = {
//   Query: {
//     whatsForDinner: () => {
//       const idx = Math.floor(Math.random() * dinnerOptions.length);
//       const foodChoice = dinnerOptions[idx];
//       return `Tonight we eat ${foodChoice}`;
//     },
//   },
// };

// const opts = {
//   port: 4000,
//   endpoint: "/graphql",
// };

// const server = new GraphQLServer({ typeDefs, resolvers, opts });

// server.start(() => {
//   console.log(
//     `😄 Server running at http://localhost:${opts.port}${opts.endpoint}`
//   );
// });

const { GraphQLServer } = require("graphql-yoga");

let count = 2;
let todos = [
  {
    id: "0",
    content: "Buy milk",
    isCompleted: true,
  },
  {
    id: "1",
    content: "Cook some lobster",
    isCompleted: false,
  },
  {
    id: "2",
    content: "buy cakkee",
    isCompleted: false,
  },
];

const typeDefs = `
  type Todo {
    id: ID!
    content: String!
    isCompleted: Boolean!
  }
  type Query {
    allTodos: [Todo!]!
    Todo(id: ID!): Todo!
  }
  type Mutation {
    createTodo(content: String!, isCompleted: Boolean!): Todo!
    updateTodo(id: ID!, content: String, isCompleted: Boolean): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

const resolvers = {
  Query: {
    allTodos: () => {
      return todos;
    },
    Todo: (_, { id }) => {
      const todo = todos.find((x) => x.id === id);
      if (!todo) {
        throw new Error("Cannot find your todo!");
      }
      return todo;
    },
  },
  Mutation: {
    createTodo: (_, { content, isCompleted }) => {
      const newcount = ++count;
      const newTodo = {
        id: `${newcount}`,

        content,
        isCompleted,
      };
      todos = [...todos, newTodo];
      console.log(todos);
      return newTodo;
    },
    updateTodo: (_, { id, content, isCompleted }) => {
      let updatedTodo;

      todos = todos.map((todo) => {
        if (todo.id === id) {
          updatedTodo = {
            id: todo.id,
            // for content and isCompleted, we first check if values are provided
            content: content !== undefined ? content : todo.content,
            isCompleted:
              isCompleted !== undefined ? isCompleted : todo.isCompleted,
          };
          return updatedTodo;
        } else {
          return todo;
        }
      });

      return updatedTodo;
    },
    deleteTodo: (_, { id }) => {
      const todoToDelete = todos.find((x) => x.id === id);

      todos = todos.filter((todo) => {
        return todo.id !== todoToDelete.id;
      });

      return todoToDelete;
    },
  },
};

const opts = {
  port: 4000,
  endpoint: "/graphql",
};

const server = new GraphQLServer({ typeDefs, resolvers, opts });

server.start(() => {
  console.log(
    `😄 Server running at http://localhost:${opts.port}${opts.endpoint}`
  );
});

module.exports = router;
