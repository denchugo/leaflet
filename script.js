let lat = 34.966005; // 緯度
let lon = 136.166626; // 経度
let zoom = 16; // ズームレベル

let version = 'Y2020'; //地図バージョン
let eqcase = 'AVR'; // 確率ケース
let eqcode = 'TTL_MTTL'; //地震コード
let format = 'geojson'; // 出力形式
let epsg = 4326; //測地系
let attr = 'T30_I50_PS' //30年間で震度5強以上となる確率

let map = L.map("map");
map.setView([lat, lon], zoom);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
	attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	}).addTo(map);
// L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
// 	attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
// 	}).addTo(map);
	map.on('click', onMapClick);

function onMapClick(e) {
	let lat = e.latlng.lat;	//クリックされた経度
	let lon = e.latlng.lng;	//クリックされた緯度
	let position = `${lon},${lat}`;
	let url = `https://www.j-shis.bosai.go.jp/map/api/pshm/${version}/${eqcase}/${eqcode}/meshinfo.${format}?
				position=${position}&epsg=${epsg}&attr=${attr}`;	//地震メッシュを取得するURL
    
	axios.get(url).then(response => {     
    	let data = response["data"]; // geojson形式の地震情報
		let meshcode = response["data"]["features"][0]["properties"]["meshcode"];	// メッシュコード
		let prob = Number(response["data"]["features"][0]["properties"][attr]);	//震度の確率

    	let mesh = L.geoJSON(data, {
			style: setMeshStyle(prob)
		}).on('click', onMeshClick);
		mesh.bindTooltip(
			`<p>MeshCode: ${meshcode} <br> 発生確率: ${Math.round(prob * 100)}%</p>`,
			{permanent: true, direction: "center",opacity:0.7, className: "my-labels"}
		);
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

function setMeshStyle(prob){
	let meshColor =	prob <= 0.2 ? '#ffaaaa' :
					prob <= 0.4 ? '#ff5555' :
					prob <= 0.6 ? '#ff0000' :
					prob <= 0.8 ? '#aa0000' :
								'#550000'; 
	let mesh_style = {
		color: meshColor, // 枠線の色
		fillColor: meshColor // 塗りつぶしの色
	}
	return mesh_style;
}
