class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.entryField.addEventListener("change", (evt) => {
			normalSearch();
		});
		this.entryField.addEventListener("focus", (evt) => {
			this.entryField.select();
		});
		this.kanjiNoField = document.getElementById("KanjiNoField");
		this.kanjiNoField.addEventListener("change", (evt) => {
			directOpen();
		});
		this.kanjiNoField.addEventListener("focus", (evt) => {
			this.kanjiNoField.select();
		});
		this.preambleSelector = document.getElementById("PreambleSelector");
		loadSelector(this.preambleSelector, summary);
		this.columnSelector = document.getElementById("ColumnSelector");
		loadSelector(this.columnSelector, column);
		this.referenceSelector = document.getElementById("ReferenceSelector");
		loadSelector(this.referenceSelector, refs);
		this.candidatePanel = document.getElementById("CandidatePanel");
	}
}

class Regulator {
	constructor() {
		this.conversionTable = {
			ぁ: "あ", ぃ: "い", 	ゔ: "う", ぅ: "う", ぇ: "え", ぉ: "お",
			が: "か", ゕ: "か", ぎ: "き", ぐ: "く", げ: "け", ゖ: "け", ご: "こ",
			ざ: "さ", じ: "し", ず: "す", ぜ: "せ", ぞ: "そ",
			だ: "た", ぢ: "ち", づ: "つ", っ: "つ", で: "て", ど: "と",
			ば: "は", ぱ: "は", び: "ひ", ぴ: "ひ", ぶ: "ふ", ぷ: "ふ", べ: "へ", ぺ: "へ", ぼ: "ほ", ぽ: "ほ",
			ゃ: "や", ゅ: "ゆ", ょ: "よ", ゎ: "わ",
			ァ: "ア", ィ: "イ", ヴ: "ウ", ゥ: "ウ", ェ: "エ", ォ: "オ",
			ガ: "カ", ヵ: "カ", ギ: "キ", グ: "ク", ゲ: "ケ", ヶ: "ケ", ゴ: "コ",
			ザ: "サ", ジ: "シ", ズ: "ス", ゼ: "セ", ゾ: "ソ",
			ダ: "タ", ヂ: "チ", ヅ: "ツ", ッ: "ツ", デ: "テ", ド: "ト",
			バ: "ハ", パ: "ハ", ビ: "ヒ", ピ: "ヒ", ブ: "フ", プ: "フ", ベ: "ヘ", ペ: "ヘ", ボ: "ホ", ポ: "ホ",
			ャ: "ヤ", ュ: "ユ", ョ: "ヨ", ヮ: "ワ",
		};
	}
	regulate(str) {
		let result = "";
		let ar = str.split("");
		for (let i = 0; i < ar.length; i++) {
			if (ar[i] in this.conversionTable) {
				result += this.conversionTable[ar[i]];
			} else {
				result += ar[i];
			}
		}
		return result;
	}
}	// end of Regulator class
const R = new Regulator();

const G = new GlobalManager();
EntryField.focus();

function normalSearch() {
	let target = EntryField.value;
	target = target.replaceAll(/[^\u3040-\u309F\u30A0-\u30FF]/g, "");
	if (target.match(/^[\u30A0-\u30FF]+$/)) {
		search(target, katakanaIndex);
	} else {
		search(target, hiraganaIndex);
	}
}

function search(target, indexArray) {
	G.candidatePanel.innerHTML = "";
	if (target == "")  return;
	target = R.regulate(target);
	let idx = indexArray.length - 1;
	while(target < indexArray[idx]) {
		idx--;
	}
	window.open("https://dl.ndl.go.jp/pid/13325208/1/" + (302-idx), "索引検索結果");
	
}


function directOpen() {
	const kNo = G.kanjiNoField.value;
	if (kNo.match(/^\d+$/)) {
		let ptr = kID.length - 1;
		const target = Number(kNo);
		while(kID[ptr] > target) {
			ptr--;
		}
		window.open("https://dl.ndl.go.jp/pid/13325208/1/" + (kID[0]+ptr), "漢字通し番号検索結果");
	} else if (kNo.match(/^\s*$/)) {
		G.kanjiNoField.value = "";
	} else {
		alert(kNo + " : 漢字の通し番号を入力してください。");
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
		window.open("https://dl.ndl.go.jp/pid/13325208/1/" + frameNo, "各種検索");
		selector.selectedIndex = 0;
	});
}
