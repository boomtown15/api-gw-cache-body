export const handler = async (event) => {

    const timestamp = new Date().toISOString();

    try {
        // print event
        console.log(JSON.stringify(event));
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'POST request processed successfully at ' + timestamp,
                eventDetails: event
            })
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Internal server error',
                errorDetails: {
                    name: error.name,
                    message: error.message,
                    cause: error.cause
                }
            })
        };
    }
};