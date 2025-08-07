class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.entryField.addEventListener("change", (evt) => {
			normalSearch();
		});
		this.entryField.addEventListener("focus", (evt) => {
			this.entryField.select();
		});
		this.nombreField = document.getElementById("NombreField");
		this.nombreField.addEventListener("change", (evt) => {
			directOpen();
		});
		this.nombreField.addEventListener("focus", (evt) => {
			this.nombreField.select();
		});
		this.candidatePanel = document.getElementById("CandidatePanel");
		this.preambleSelector = document.getElementById("PreambleSelector");
	}
}
const G = new GlobalManager();
window.onload = () => {
	loadSelector(G.preambleSelector, summary);
}

EntryField.focus();

function normalSearch() {
	G.candidatePanel.innerHTML = "";
	let target = G.entryField.value;
	target = target.replaceAll(/[^\u3041-\u3096\u30A1-\u30F6]/g, "");
	if (target == "")  return;
	target = conv(target);
	if (target.match(/[\u30A1-\u30F6]/)) {		// カタカナが含まれているか？
		search(katakanaIndex, target);
	} else {
		search(hiraganaIndex, target);
	}
}

function conv(str) {
	const dict = {
		"ぁ": "あ", "ぃ": "い", "ゐ": "い", "ぅ": "う", "ぇ": "え", "ゑ": "え", "ぉ": "お", "を": "お",
		"が": "か", "ぎ": "き", "ぐ": "く", "げ": "け", "ご": "こ",
		"ざ": "さ", "じ": "し", "ず": "す", "ぜ": "せ", "ぞ": "そ",
		"だ": "た", "ぢ": "ち", "づ": "つ", "っ": "つ", "で": "て", "ど": "と",
		"ば": "は", "び": "ひ", "ぶ": "ふ", "べ": "へ", "ぼ": "ほ",
		"ぱ": "は", "ぴ": "ひ", "ぷ": "ふ", "ぺ": "へ", "ぽ": "ほ",
		"ゃ": "や", "ゅ": "ゆ", "ょ": "よ",
	};
	if (str.match(/[\u30A0-\u30FF]/)) {		// カタカナが含まれている場合、いったんひらがなに修正後、正規化する
		const hiraStr = str.replace(/[\u30A1-\u30F6]/g, (ch) => {
			const code = ch.charCodeAt(0);
			return String.fromCharCode(code - 0x60);
		});
		const arr = hiraStr.split("");
		const convStr = arr.map((x) => { return dict[x] || x;}).join("");
		return convStr.replace(/[\u3041-\u3096]/g, (ch) => {
			const code = ch.charCodeAt(0);
			return String.fromCharCode(code + 0x60);
		});
	}
	const arr = str.split("");
	return arr.map((x) => { return dict[x] || x;}).join("");
}

function search(database, target) {
	let idx = database.length - 1;
	while(target < database[idx]) {
		idx--;
	}
	const frameNo = 206 - idx;
	window.open("https://dl.ndl.go.jp/pid/13210768/1/" + frameNo, "索引検索");
}


function directOpen() {
	const pageNo = G.nombreField.value;
	if (pageNo.match(/^\d+$/)) {
		const frameNo = Math.trunc(Number(pageNo) / 2) + 11
		window.open("https://dl.ndl.go.jp/pid/13210768/1/" + frameNo, "ページ検索");
	} else {
		alert(pageNo + " : ページ番号を入力してください。");
	}
}

function loadSelector(selector, data) {
	selector.appendChild(document.createElement("option"));
	for (let i = 0; i < data.length; i++) {
		let name = data[i][0];
		let val = data[i][1]
		let elem = document.createElement("option");
		elem.text = name;
		elem.value = val;
		selector.appendChild(elem);
	}
	selector.addEventListener("change", () => {
		const frameNo = selector[selector.selectedIndex].value;
		window.open("https://dl.ndl.go.jp/pid/13210768/1/" + frameNo, "各種検索");
		selector.selectedIndex = 0;
	});
}


function bushu(nos) {
//	console.log(bushuIndex[nos]);
	G.candidatePanel.innerHTML = "";
	const table = document.createElement("table");
	table.border = 1;
	G.candidatePanel.appendChild(table);
	const colMax = 8;
	let colCount = 9;
	let row;
	let prevKanji = "";
	const dataCluster = bushuIndex[nos];
	for(let i = 1; i < dataCluster.length; i++) {
		const frameNo = bushuIndex[nos][0] + i;
		const entries = bushuIndex[nos][i].match(/［.*?］|./g);
		for (let kanji of entries) {
			if (kanji == prevKanji) {
				continue;
			}
			prevKanji = kanji;
			kanji = kanji.replace(/[［］]/g, "");
			if (colCount >= colMax) {
				row = table.insertRow(-1);
				colCount = 0;
			}
			let cell = row.insertCell(colCount);
			const a = document.createElement("a");
			a.href = "https://dl.ndl.go.jp/pid/13210768/1/" + frameNo;
			a.target = "各種検索";
			a.innerHTML = kanji;
			cell.append(a);
			/*
			const button = document.createElement("button");
			button.innerHTML =kanji;
			button.addEventListener ("click", () => {
				window.open("https://dl.ndl.go.jp/pid/13210768/1/" + frameNo, "各種検索");
			});
			cell.appendChild(button);
			*/
			colCount++;
		}
	}
}
