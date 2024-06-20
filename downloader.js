async function download_splat(url_param) {
    const url = new URL(url_param);

    const req = await fetch(url, {
        mode: "cors",
        credentials: "omit",
    });
    console.log(req);
    if (req.status != 200)
        throw new Error("download_splat(): HTTP status: " + req.status + ", failed to load " + req.url);

    const reader = req.body.getReader();
    let splatData = new Uint8Array(req.headers.get("content-length"));
    let bytesRead = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        splatData.set(value, bytesRead);
        bytesRead += value.length;

        postMessage({
            bytes: bytesRead,
            buffer: splatData,
        });
    }
}

self.onmessage = async function(event) {
    console.log("downloader.js: Received message:", event.data);
    await download_splat(event.data);
};
