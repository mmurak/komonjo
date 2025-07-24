class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.entryField.addEventListener("input", (evt) => {
			incrementalSearch();
		});
		this.entryField.addEventListener("focus", (evt) => {
			this.entryField.select();
		});
		this.headCB = document.getElementById("HeadCB");
		this.headCB.addEventListener("click", (evt) => {
			incrementalSearch();
			this.entryField.select();
		});
		this.tailCB = document.getElementById("TailCB");
		this.tailCB.addEventListener("click", (evt) => {
			incrementalSearch();
			this.entryField.select();
		});
		this.candidatePanel = document.getElementById("CandidatePanel");
		document.addEventListener("keydown", (evt) => {
			if (evt.key == "Escape") {
				this.entryField.value = "";
				incrementalSearch();
				this.entryField.select();
			}
		});
		document.addEventListener("click", (evt) => {
			this.entryField.select();
		});
	}
}
const G = new GlobalManager();


class Regulator {
	constructor() {
		this.conversionTable = {
			ぁ: "あ", ぃ: "い", 	ゔ: "う", ぅ: "う", ぇ: "え", ぉ: "お",
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

function incrementalSearch() {
	let target = EntryField.value;
	target = R.regulate(target);
	target = target.replaceAll(/[^\u3040-\u309F\u30A0-\u30FF、]/g, "");
	search(target);
}

function search(target) {
	G.candidatePanel.innerHTML = "";
	const table = document.createElement("table");
	G.candidatePanel.appendChild(table);
	if (target == "")  return;
	const preamble = (G.headCB.checked) ? "^" : "";
	const postamble = (G.tailCB.checked) ? "$" : "";
	const regexp = new RegExp(preamble + target + postamble);
	for (let i = 1; i < database.length; i++) {
//		if (database[i][2].indexOf(target) == 0) {
		if (database[i][2].match(regexp)) {
			const row = table.insertRow(-1);
			const frameCell = row.insertCell(0);
			frameCell.innerHTML = database[i][4];
			frameCell.style = "text-align: right;";
			const generalCell = row.insertCell(1);
			generalCell.innerHTML = (database[i][3] == 1) ? "*" : "";
			generalCell.style = "font-size:0.7em;";
			const anchorCell = row.insertCell(2);
			const anchor = document.createElement("a");
			anchor.href = "https://dl.ndl.go.jp/pid/13231550/1/" + database[i][4];
			anchor.target = "索引検索";
			anchor.innerHTML = database[i][0] + "（" + database[i][1] + "）";
			anchor.title = ((database[i][3] == 1) ? "日常語彙：" : "") +database[i][4];
			anchorCell.appendChild(anchor);
		}
	}
}
