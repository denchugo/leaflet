let lat = 34.966005; // 緯度
let lon = 136.166626; // 経度
let zoom = 16; // ズームレベル

let version = 'Y2020'; //地図バージョン
let eqcase = 'AVR'; // 確率ケース
let eqcode = 'TTL_MTTL'; //地震コード
let format = 'geojson'; // 出力形式
let epsg = 4326; //測地系
let attr = 'T30_I50_PS' //30年間で震度5強以上となる確率
// let mesh;

let map = L.map("map");
map.setView([lat, lon], zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', onMapClick);

function onMapClick(e) {
	let lat = e.latlng.lat;	//クリックされた経度
	let lon = e.latlng.lng;	//クリックされた緯度
	let position = `${lon},${lat}`;
	let url = `https://www.j-shis.bosai.go.jp/map/api/pshm/${version}/${eqcase}/${eqcode}/meshinfo.${format}?
				position=${position}&epsg=${epsg}&attr=${attr}`;	//地震メッシュを取得するURL
    
	axios.get(url).then(response => {     
    	let data = response["data"]; // geojson形式の地震情報
    	let mesh = L.geoJSON(data, {
			style: function(feature){
				let mesh_style;
				mesh_style = {
					color: "#ff0000", // 枠線の色
					fillColor: "#ff0000" // 塗りつぶしの色
        		}
				return mesh_style;
			}
		// }).on('click', onMeshClick).addTo(map);
		}).on('click', onMeshClick);
		// メッシュコード
		let meshcode = response["data"]["features"][0]["properties"]["meshcode"]
		// 30年間で震度5強以上となる確率
		let prob = Number(response["data"]["features"][0]["properties"][attr])
		mesh.bindTooltip(
			`<p>メッシュコード: ${meshcode} <br> 発生確率: ${prob * 100}%</p>`
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
