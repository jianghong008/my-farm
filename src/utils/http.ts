export function httpGet(url: string, json = false): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(json ? JSON.parse(xhr.responseText) : xhr.responseText);
                } else {
                    reject(xhr.responseText);
                }
            }
        };
        xhr.send();
    })
}