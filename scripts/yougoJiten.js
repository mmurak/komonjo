class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.nandoku = document.getElementById("Nandoku");
	}
}	// end of GlobalManager class
const G = new GlobalManager();

G.entryField.focus();

class Regulator {
	constructor() {
		this.conversionTable = {
			ぁ: "あ", ぃ: "い", ゔ: "う", ぅ: "う", ぇ: "え", ぉ: "お",
			が: "か", ゕ: "か", ぎ: "き", ぐ: "く", げ: "け", ゖ: "け", ご: "こ",
			ざ: "さ", じ: "し", ず: "す", ぜ: "せ", ぞ: "そ",
			だ: "た", ぢ: "ち", づ: "つ", っ: "つ", で: "て", ど: "と",
			ば: "は", ぱ: "は", び: "ひ", ぴ: "ひ", ぶ: "ふ", ぷ: "ふ", べ: "へ", ぺ: "へ", ぼ: "ほ", ぽ: "ほ",
			ゃ: "や", ゅ: "ゆ", ょ: "よ", ゎ: "わ",
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

G.entryField.focus();
document.addEventListener("keyup", (evt) => {
	if (evt.key == "Enter") {
		search();
	} else if (evt.key == "Escape") {
		clearField();
	}
}, false);


G.nandoku.addEventListener("click", (evt) => {
//	G.nandoku.selectedIndex = 0;
	evt.stopPropagation();
}, false);
G.nandoku.addEventListener("change", (evt) => {
	G.entryField.value = "";
	const frameNo = G.nandoku[G.nandoku.selectedIndex].value;
	if (frameNo == 0)  return;
	window.open(baseURL + frameNo, "難読画引索引");
	G.nandoku.selectedIndex = 0;
	G.entryField.select();
}, false);

document.addEventListener("click", (evt) => {
	G.entryField.select();
});

function windowOpen(url) {
	window.open(url, "検索結果");
	G.entryField.focus();
}

function search() {
	let target = G.entryField.value;
	target = target.replace(/[ァ-ン]/g, (s) => {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	let rTarget = R.regulate(target);
	if (rTarget.match(/[^あ-ん]/)) {
		alert("ひらがなで入力してください。");
		return;
	}
	if (rTarget.length == 0)  return;
	let idx = indexData.length - 1;
	while ((idx >= 0) && (indexData[idx] > rTarget)) {
		idx--;
	}
//	console.log(idx+indexData[0]);
	windowOpen(baseURL + (idx + indexData[0]));
}

function clearField() {
	G.entryField.value = "";
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
		window.open("https://dl.ndl.go.jp/pid/12156459/1/" + frameNo, "各種検索");
		selector.selectedIndex = 0;
	});
}
