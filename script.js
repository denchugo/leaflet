let lat = 34.966005; // 緯度
let lon = 136.166626; // 経度
let zoom = 16; // ズームレベル

let map = L.map("map");
map.setView([lat, lon], zoom);
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
	attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	}).addTo(map);
	map.on('click', onMapClick);

function onMapClick(e) {
	let lat = e.latlng.lat;	//クリックされた経度
	let lon = e.latlng.lng;	//クリックされた緯度
	let position = `${lon},${lat}`;
	let url = `https://frogcat.github.io/japan-small-area/25.json`;	//国勢調査小地域を取得するURL

	axios.get(url).then(response => {
    	let data = response["data"]; // geojson形式の小地域
    	let mesh = L.geoJSON(data, {filter: function (feature, layer){
			let addr = feature.properties.fullname;
			return addr.includes('甲賀市'); 
			}
		}).on('click', onMeshClick);
		mesh.addTo(map);
		// メッシュを地図に追加＋追加したメッシュのクリックイベント処理を追加
	});
}

function onMeshClick(e) {
	//メッシュのclickイベント呼び出される
	//クリックされたメッシュを地図のレイヤから削除する
	map.removeLayer(e.target);	//メッシュを削除
	map.off(mesh);
}

function kokaFilter(feature, layer){
	const addr =  new String(features.properties.fullname);
	return addr.includes("滋賀県/甲賀市/");
}