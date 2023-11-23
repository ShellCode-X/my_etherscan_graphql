const { ApolloServer } = require("apollo-server");
// Import schema from graphql files
const { importSchema } = require("graphql-import");
// Import custom data source
const EtherDataSource = require("./datasource/ethDatasource");
// Import schema
const typeDefs = importSchema("./schema.graphql");

// Load environment variables
require("dotenv").config();

// Resolvers mapping
const resolvers = {
  Query: {
    // Get ether balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Get total ether supply
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Get latest ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Get block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }),
});

// Disable timeouts
server.timeout = 0;
// Start server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

