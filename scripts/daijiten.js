class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.entryField.addEventListener("input", (evt) => {
			incrementalSearch();
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
		this.referenceSelector = document.getElementById("ReferenceSelector");
		loadSelector(this.referenceSelector, refs);
		this.figureSelector = document.getElementById("FigureSelector");
		loadSelector(this.figureSelector, figures);
		this.usageSelector = document.getElementById("UsageSelector");
		loadSelector(this.usageSelector, dossiers);
		this.candidatePanel = document.getElementById("CandidatePanel");
	}
}
const G = new GlobalManager();
EntryField.focus();

function incrementalSearch() {
	let target = EntryField.value;
	target = target.replaceAll(/[^\u3040-\u309F\u30A0-\u30FF]/g, "");
	search(target);
}

function search(target) {
	G.candidatePanel.innerHTML = "";
	if (target == "")  return;
	for (let i = 1; i < kanjiIndex.length; i++) {
		if (kanjiIndex[i].indexOf(target) == 0) {
			const div = document.createElement("div");
			let offset = 0;
			while(i >= pageOffset[offset]) offset++;
			const anchor = document.createElement("a");
			anchor.href = "https://dl.ndl.go.jp/pid/12205340/1/" + (254-offset);
			anchor.target = "索引検索";
			anchor.innerHTML = kanjiIndex[i];
			div.appendChild(anchor);
			G.candidatePanel.appendChild(div);
		}
	}
}


function directOpen() {
	const kNo = G.kanjiNoField.value;
	if (kNo.match(/^\d+$/)) {
		let ptr = kID.length - 1;
		const target = Number(kNo);
		while(kID[ptr] > target) {
			ptr--;
		}
		window.open("https://dl.ndl.go.jp/pid/12205340/1/" + (kID[0]+ptr), "漢字通し番号検索");
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
		window.open("https://dl.ndl.go.jp/pid/12205340/1/" + frameNo, "各種検索");
		selector.selectedIndex = 0;
	});
}


function setBushu(nos) {
	G.candidatePanel.innerHTML = "";
	const table = document.createElement("table");
	G.candidatePanel.appendChild(table);
	const colMax = 5;
	let colCount = 6;
	let row;
	for(let i = 0; i < bushuIndex[nos-1].length; i++) {
		if (colCount >= colMax) {
			row = table.insertRow(-1);
			colCount = 0;
		}
		let cell = row.insertCell(colCount);
		const button = document.createElement("button");
		button.innerHTML = bushuIndex[nos-1][i][0];
		button.addEventListener("click", () => {
			const page = bushuIndex[nos-1][i][1];
			const frameNo = Math.trunc(page / 2) + 8;
			window.open("https://dl.ndl.go.jp/pid/12205340/1/" + frameNo, "各種検索");
		});
		cell.appendChild(button);
		colCount++;
	}
}

