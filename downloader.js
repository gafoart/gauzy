async function download_splat(url_param) {
    try {
        const url = new URL(url_param);
        const req = await fetch(url, { mode: "cors", credentials: "omit" });

        if (req.status !== 200) {
            throw new Error(`HTTP status: ${req.status}, failed to load ${req.url}`);
        }

        const reader = req.body.getReader();
        const contentLength = +req.headers.get("content-length");
        let splatData = new Uint8Array(contentLength);
        let bytesRead = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            splatData.set(value, bytesRead);
            bytesRead += value.length;

            postMessage({ bytes: bytesRead, buffer: splatData });
        }
    } catch (error) {
        console.error("Error in download_splat:", error);
    }
}

self.onmessage = async function(event) {
    await download_splat(event.data);
};
