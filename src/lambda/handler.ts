import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const producer = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const { orderId } = JSON.parse(event.body!);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order created',
        orderId,
      }),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating order',
      }),
    };
  }
};

export const consumer = async (): Promise<void> => {
  console.log('finished processing order');
};