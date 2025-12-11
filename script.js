const statusEl = document.getElementById("status");
const mapEl = document.getElementById("map");
let map;

function initMap(lat, lon) {
    mapEl.style.display = "block";
    map = L.map('map').setView([lat, lon], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('現在地')
        .openPopup();
}

function extractPrefecture(address) {
    return (
        address.state ||
        address.region ||
        address.province ||
        address.county ||
        ""
    );
}

document.getElementById("btn").onclick = async () => {
    statusEl.textContent = "位置情報を取得しています…";

    if (!navigator.geolocation) {
        statusEl.textContent = "ブラウザが位置情報に対応していません。";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        initMap(lat, lon);

        statusEl.textContent = "住所を取得しています…";

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ja`;
        const res = await fetch(url);
        const data = await res.json();

        const a = data.address;

        const prefecture = extractPrefecture(a);
        // 市（政令市含む）だけ取得。town や village は町名扱いなので除外。
        const city = a.city || a.municipality || ""; // 市は保持、町名は使わない
        const wa// 町名を除き、都道府県 + 市 + 区 のみ
        const locationText = `${prefecture} ${city}${ward ? " " + ward : ""}`;= `${prefecture} ${city}${ward ? " " + ward : ""}`;

        const tweetText = `自分は現在、${locationText} にいます！\nhttps://www.temp.net/現在地つーる`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

        statusEl.textContent = "ツイート画面を開きました！";
        window.open(tweetUrl, "_blank");

    }, () => {
        statusEl.textContent = "位置情報の取得に失敗しました。";
    });
};
