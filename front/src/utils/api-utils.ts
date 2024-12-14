// dotenv経由で指定するので、型はstringとしておく
const endpointUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL as string;

export const getApiUtils = () => ({
  getHello: async () => {
    const response = await fetch(`${endpointUrl}/hello/`);
    return response.json();
  },
});
