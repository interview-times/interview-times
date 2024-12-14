export const getApiUtils = () => ({
  getHello: async (answer: string) => {
    const params = new URLSearchParams({
      answer,
      lang: "ja",
    });
    const response = await fetch(`/api/hello?${params.toString()}`);
    return response.json();
  },
});
