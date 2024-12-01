const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLFloat, GraphQLInt } = require('graphql');
const axios = require('axios');

// Define the WeatherType
const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields: {
        temperature: { type: GraphQLFloat },
        windspeed: { type: GraphQLFloat },
        winddirection: { type: GraphQLFloat },
        weathercode: { type: GraphQLInt },
        time: { type: GraphQLString },
        location: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString }
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
                
                try {
                    // Get location name using Geocoding API
                    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`;
                    const geoResponse = await axios.get(geoUrl);
                    const locationData = geoResponse.data.results?.[0] || {};
                    
                    // Get weather data
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
                    const weatherResponse = await axios.get(weatherUrl);
                    const { current_weather } = weatherResponse.data;
                    
                    return {
                        temperature: current_weather.temperature,
                        windspeed: current_weather.windspeed,
                        winddirection: current_weather.winddirection,
                        weathercode: current_weather.weathercode,
                        time: current_weather.time,
                        location: `${latitude}, ${longitude}`,
                        city: locationData.name || 'Unknown',
                        country: locationData.country || 'Unknown'
                    };
                } catch (error) {
                    console.error('Error fetching data:', error.response?.data || error.message);
                    throw new Error('Failed to fetch weather data');
                }
            },
        },
    },
});

// Export schema
module.exports = new GraphQLSchema({
    query: RootQuery,
});
