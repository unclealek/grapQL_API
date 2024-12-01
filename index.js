const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable the GraphiQL interface
}));

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
