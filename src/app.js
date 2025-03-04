export const handler = async (event) => {

    try {
        const timestamp = new Date().toLocaleTimeString();
        console.log(JSON.stringify(event));

        return {
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