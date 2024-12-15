export const getApiUtils = () => ({
  getHello: async (answer: string) => {
    const params = new URLSearchParams({
      answer,
      lang: "ja",
    });
    const response = await fetch(`/api/hello?${params.toString()}`);
    return response.json();
  },
  postRecord: async (audio: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        // console.log(base64);
        const response = await fetch("/api/", {
          method: "POST",
          body: JSON.stringify({
            record: base64,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("アップロードに失敗しました");
        }
        const result = await response.json();
        // console.log("アップロード成功:", result);
        resolve(result);
      };

      reader.readAsDataURL(audio);
    });
  },
});
