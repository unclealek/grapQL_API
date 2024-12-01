const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat } = require('graphql');
const axios = require('axios');

// Define the WeatherType
const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields: {
        temperature: { type: GraphQLFloat },
        location: { type: GraphQLString },
        time: { type: GraphQLString },
    },
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        weather: {
            type: WeatherType,
            args: {
                latitude: { type: GraphQLString },
                longitude: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const { latitude, longitude } = args;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

                const response = await axios.get(url);
                const temperatureData = response.data.hourly.temperature_2m[0]; // First data point
                const time = response.data.hourly.time[0];

                return {
                    temperature: temperatureData,
                    location: `${latitude}, ${longitude}`,
                    time,
                };
            },
        },
    },
});

// Export schema
module.exports = new GraphQLSchema({
    query: RootQuery,
});
