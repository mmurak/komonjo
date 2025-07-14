class GlobalManager {
	constructor() {
		this.entryField = document.getElementById("EntryField");
		this.entryField.addEventListener("change", (evt) => {
			normalSearch();
		});
		this.entryField.addEventListener("focus", (evt) => {
			this.entryField.select();
		});
		this.bunreiNoField = document.getElementById("BunreiNoField");
		this.bunreiNoField.addEventListener("change", (evt) => {
			directOpen();
		});
		this.bunreiNoField.addEventListener("focus", (evt) => {
			this.bunreiNoField.select();
		});
		this.preambleSelector = document.getElementById("PreambleSelector");
		loadSelector(this.preambleSelector, summary);
		this.referenceSelector = document.getElementById("ReferenceSelector");
		this.candidatePanel = document.getElementById("CandidatePanel");
	}
}
const G = new GlobalManager();
EntryField.focus();

fixLink(koubunsho);
fixLink(shojo);

function normalSearch() {
	let target = EntryField.value;
	target = target.replaceAll(/[^\u3040-\u309F\u30A0-\u30FF]/g, "");
	search(target);
}

function search(target) {
	G.candidatePanel.innerHTML = "";
	let ptr = phonIndex.length - 1;
	while (target < phonIndex[ptr]) ptr--;
	window.open("https://dl.ndl.go.jp/pid/12188686/1/" + (254+ptr), "索引検索結果");
}


function directOpen() {
	const bNo = G.bunreiNoField.value;
	if (bNo.match(/^\d+$/)) {
		let ptr = bID.length - 1;
		const target = Number(bNo);
		while(bID[ptr] > target) {
			ptr--;
		}
		window.open("https://dl.ndl.go.jp/pid/12188686/1/" + (bID[0]+ptr), "文例検索結果");
	} else if (bNo.match(/^\s*$/)) {
		G.bunreiNoField.value = "";
	} else {
		alert(bNo + " ??? : 文例番号を入力してください。");
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
		window.open("https://dl.ndl.go.jp/pid/12188686/1/" + frameNo, "各種検索");
		selector.selectedIndex = 0;
	});
}
function setKanyo(obj) {
	G.candidatePanel.innerHTML = "";
	G.referenceSelector.selectedIndex = 0;
	const table = document.createElement("table");
	table.border = 1;
	G.candidatePanel.appendChild(table);
	const colMax = 10;
	let colCount = colMax +1;
	let row;
	const kanAll = kanyoku[obj.innerHTML];
	for (const kanset of kanAll) {
		const frame = kanset[0];
		for (let i = 1; i < kanset.length; i++) {
			if (colCount >= colMax) {
				row = table.insertRow(-1);
				colCount = 0;
			}
			const cell = row.insertCell(colCount);
			cell.innerHTML = kanset[i].split("").join("<br>");
			cell.addEventListener("click", () => {
				window.open("https://dl.ndl.go.jp/pid/12188686/1/" + frame, "索引検索結果");
			});
			colCount++;
		}
	}
}

function fixLink(array) {
	for (let i = 0; i < array.length; i++) {
		const m = array[i].match(/^#(\d+)(.+)$/);
		if (m != null) {
			const frame = m[1];
			let content = m[2];
			const anchor = "<li><a href=https://dl.ndl.go.jp/pid/12188686/1/" + frame + " target='文例検索結果'>";
			content = content.replace("<li>", anchor);
			array[i] = content.replace("</li>", "</a></li>");
		}
	}
}

function selectorChange(obj) {
	G.candidatePanel.innerHTML = "";
	const val = obj[obj.selectedIndex].value;
	switch (val) {
		case "1":
			G.candidatePanel.innerHTML = koubunsho.join("");
			break;
		case "2":
			G.candidatePanel.innerHTML = shojo.join("");
			break;
		default:
	}
}
