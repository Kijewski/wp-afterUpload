/*
 *  afterUpload ­– lets you inspect edits a user did after uploading an image
 *  Copyright (C) 2009-2013 René Kijewski  rene <dot> <surname> <at> fu–berlin <dot> de
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var wikilist = [
	'de',
	'ar',
	'bar',
	'ca',
	'cs',
	'da',
	'dsb',
	'el',
	'en',
	'es',
	'fa',
	'fi',
	'fr',
	'frp',
	'frr',
	'fy',
	'he',
	'hi',
	'hr',
	'hsb',
	'hu',
	'id',
	'it',
	'ja',
	'ko',
	'ksh',
	'la',
	'lb',
	'li',
	'lmo',
	'nds',
	'nl',
	'no',
	'pdc',
	'pl',
	'pt',
	'rm',
	'ro',
	'ru',
	'sk',
	'sl',
	'sq',
	'sr',
	'stq',
	'sv',
	'th',
	'tr',
	'uk',
	'vi',
	'yi',
	'zh'].map(function (s) { return '//' + s + '.wikipedia.org/'; });
var requestList = {};
var requestList = {};
var wikilistDialog = null;
var wikilistOptions = [ "size", "family", "lang", "limit" ];
var nextRequestid = 0;
var parameters = {
	"lang": null,
	"project": null,
	"image": null
};

function loadFromScript(url) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("charset", "UTF-8");
	script.setAttribute("src", url);
	document.getElementsByTagName("head")[0].appendChild(script);
	return script;
}

function trim(s) {
	return s.replace(/^\s+|\s+$/, "");
}

function trimHTTP(s) {
	return s.replace(/^(https?:)?\/\//, "");
}

function trimFile(s) {
	return s.replace(/^[^:]+:/, "");
}

function loadFromApi(callbackName, server, parameters, requestid) {
	var url = "//" + trimHTTP(server) + "/w/api.php";
	var delimiter = '?';
	parameters["format"] = "json";
	parameters["callback"] = callbackName;
	if(typeof(requestid) !== "undefined") {
		parameters["requestid"] = requestid;
	}
	for(var i in parameters) {
		url += delimiter + i + '=' + encodeURIComponent(parameters[i]);
		delimiter = '&';
	}
	return loadFromScript(url);
}

function newRequest(obj) {
	var res = nextRequestid++;
	requestList[res] = obj;
	return res;
}

function getActiveTab() {
	return document.getElementById("tabs").getElementsByClassName("active")[0];
}

function getFirstTab() {
	return document.getElementById("newQueryTab");
}

function showLanguageSelect() {
	var tab = makeTab(document.i18n.selected.L10n);
	document.languageSelect = tab;
	var select = document.createElement("select");
	var size = 0;
	for(var lang in document.i18n) {
		if(lang === "selected") {
			continue;
		}
		++size;
		var option = document.createElement("option");
		option.appendChild(document.createTextNode(document.i18n[lang].language));
		option.setAttribute("value", lang);
		if(lang === document.i18n.selected.id) {
			option.setAttribute("selected", "selected");
		}
		option.ondblclick = (function mkSelect(lang) {
			return function() {
				document.i18n.selected = document.i18n[lang];
				main();
				return false;
			}
		})(lang);
		select.appendChild(option);
	}
	select.setAttribute("size", size);
	select.onchange = function() {
		var option = select[select.options.selectedIndex];
		if(option) {
			document.i18n.selected = document.i18n[option.getAttribute("value")];
			var l10n1 = document.createTextNode(document.i18n.selected.L10n);
			var l10n2 = document.createTextNode(document.i18n.selected.L10n);
			tab.page.headline.replaceChild(l10n1, tab.page.headline.firstChild);
			tab.firstChild.replaceChild(l10n2, tab.firstChild.firstChild);
			submit.setAttribute("value", document.i18n.selected.select);
			newQueryTab.firstChild.replaceChild(
				document.createTextNode(document.i18n.selected.newQueryLabel),
				newQueryTab.firstChild.firstChild
			);
		}
		return false;
	};
	
	var submit = document.createElement("input");
	submit.setAttribute("type", "submit");
	submit.setAttribute("value", document.i18n.selected.select);
	
	var form = document.createElement("form");
	form.onsubmit = function() {
		var option = select[select.options.selectedIndex];
		if(option) {
			document.i18n.selected = document.i18n[option.getAttribute("value")];
			main();
		}
		return false;
	};
	form.appendChild(select);
	form.appendChild(document.createElement("br"));
	form.appendChild(submit);
	tab.page.appendChild(form);
	
	var newQueryTab = getFirstTab();
	newQueryTab.firstChild.replaceChild(
		document.createTextNode(document.i18n.selected.newQueryLabel),
		newQueryTab.firstChild.firstChild
	);
	
	tab.show();
	return tab;
}

function fillParameters(search, parameters) {
	var items = search.split('&');
	for(var i in items) {
		if(items[i]) {
			var arr = items[i].split('=', 2);
			var index, value;
			switch(arr.length) {
				case(1): {
					index = items[i];
					value = true;
					break;
				}
				case(2): {
					if(arr[0]) {
						index = arr[0];
					} else {
						index = i;
					}
					value = decodeURIComponent(arr[1]);
					break;
				}
			}
			parameters[index] = value;
		}
	}
}

function initialize() {
	if(window.location.search) {
		fillParameters(window.location.search.substr(1), parameters);
	}
	if(parameters.lang) {
		document.i18n.selected = document.i18n[parameters.lang];
		if(document.i18n.selected) {
			main();
			return false;
		} else {
			alert(document.i18n.en.selectedLanguageNotSupported);
		}
	}
	if(navigator.language) {
		document.i18n.selected = document.i18n[navigator.language];
	}
	if(!document.i18n.selected) {
		document.i18n.selected = document.i18n.en;
	}
	showLanguageSelect();
	return false;
}

function main() {
	var newQueryTab = getFirstTab();
	wikilist = document.createElement("textarea");
	wikilist.setAttribute("cols", document.i18n.selected.wl_cols);
	wikilist.setAttribute("rows", document.i18n.selected.wl_rows);
	wikilist.value = document.i18n.selected.wl_default;
	// submitWikilist();
	
	newQueryTab.firstChild.replaceChild(
		document.createTextNode(document.i18n.selected.newQueryLabel),
		newQueryTab.firstChild.firstChild
	);
	
	var d = document.getElementById("newQueryLabel");
	d.replaceChild(
		document.createTextNode(document.i18n.selected.newQueryLabel), d.firstChild
	);
	var e = document.getElementById("filenameLabel");
	e.replaceChild(
		document.createTextNode(document.i18n.selected.filenameLabel), e.firstChild
	);
	var f = document.getElementById("projectLabel");
	f.replaceChild(
		document.createTextNode(document.i18n.selected.projectLabel), f.firstChild
	);
	var g = document.getElementById("selectWikis");
	g.replaceChild(
		document.createTextNode(document.i18n.selected.selectWikis), g.firstChild
	);
	
	document.getElementById("filename").value = document.i18n.selected.filename;
	document.getElementById("project").value = document.i18n.selected.project;
	document.getElementById("queryButton").value = document.i18n.selected.query;
	
	bindTabToPage(newQueryTab, document.getElementById("newQuery"));
	
	if(document.languageSelect) {
		document.languageSelect.close();
		delete document.languageSelect;
	}
	if(parameters.image) {
		document.getElementById("filename").value = parameters.image;
	}
	if(parameters.project) {
		document.getElementById("project").value = parameters.project;
	}
	if(parameters.image && parameters.project) {
		newQuery(parameters.image, parameters.project).show();
	} else {
		getFirstTab().show();
	}
}

function makeSpinner(smll) {
	var spinner = document.createElement("img");
	spinner.setAttribute("src", document.i18n.selected.loadingGifFile);
	spinner.setAttribute("alt", document.i18n.selected.loadingText);
	spinner.setAttribute("title", document.i18n.selected.loadingText);
	if(smll) {
		spinner.style.height = document.i18n.selected.loadingGifSmallHeight;
		spinner.style.width = document.i18n.selected.loadingGifSmallWidth;
	}
	
	var spinnerA = document.createElement("a");
	spinnerA.setAttribute("href", document.i18n.selected.loadingGifHref);
	spinnerA.setAttribute("title", document.i18n.selected.loadingGifName);
	spinnerA.appendChild(spinner);
	
	spinnerA.remove = (function(spinnerA) {
		return function() {
			spinnerA.parentNode.removeChild(spinnerA);
		}
	})(spinnerA);
	return spinnerA;
}

function bindTabToPage(tab, page) {
	tab.page = page;
	tab.firstChild.setAttribute("href", '#');
	
	tab.onclose = function() {
		return false;
	}
	tab.close = function() {
		if(tab === getActiveTab()) {
			getFirstTab().show();
		}
		tab.parentNode.removeChild(tab);
		tab.page.parentNode.removeChild(tab.page);
		return tab.onclose(tab);
	};
	tab.show = function() {
		var active = getActiveTab();
		if(active !== tab) {
			tab.setAttribute("class", "active");
			tab.page.setAttribute("class", "active");
			if(active) {
				active.removeAttribute("class");
				active.page.removeAttribute("class");
			}
		}
		return false;
	}
	tab.firstChild.onclick = tab.show;
	tab.makeClosable = function() {
		if(!tab.closeSpan) {
			tab.closeSpan = document.createElement("span");
			tab.closeSpan.setAttribute("class", "sans");
			var close = document.createElement("a");
			close.setAttribute("href", "#");
			close.onclick = tab.close;
			close.appendChild(document.createTextNode("×"));
			close.style.color = "red";
			close.style.fontWeight = "bold";
			close.setAttribute("title", document.i18n.selected.closeText);
			tab.closeSpan.appendChild(document.createTextNode(" ["));
			tab.closeSpan.appendChild(close);
			tab.closeSpan.appendChild(document.createTextNode("]"));
			tab.appendChild(tab.closeSpan);
			tab.makeClosable = function() {
				return tab.closeSpan;
			};
		}
		return tab.closeSpan;
	}
	tab.makeUnclosable = function() {
		if(tab.closeSpan) {
			tab.closeSpan.parentNode.removeChild(tab.closeSpan);
		}
	}
	tab.makeSpinner = function() {
		if(!tab.page.spinner) {
			tab.spinner = makeSpinner(true);
			tab.insertBefore(tab.spinner, tab.firstChild);
			
			tab.page.spinner = document.createElement("div");
			tab.page.spinner.style.textAlign = "center";
			tab.page.appendChild(tab.page.spinner);
			tab.page.spinner.appendChild(makeSpinner(false));
		}
		return tab.page.spinner;
	}
	tab.removeSpinner = function() {
		if(tab.spinner) {
			tab.spinner.parentNode.removeChild(tab.spinner);
			delete tab.spinner;
		}
		if(tab.page.spinner) {
			tab.page.spinner.parentNode.removeChild(tab.page.spinner);
			delete tab.page.spinner;
		}
	}
}

function makeTab(label) {
	var tab = document.createElement("li");
	tab.headline = label;
	var page = document.createElement("div");
	document.getElementById("pages").appendChild(page);
	
	var a = document.createElement("a");
	a.setAttribute("class", "tabLink");
	tab.appendChild(a);
	document.getElementById("tabs").appendChild(tab);
	if(label.length > document.i18n.selected.maxLabelLength + 3) {
		tab.setAttribute("title", label);
		a.appendChild(
			document.createTextNode(
				label.substr(0, document.i18n.selected.maxLabelLength) + document.i18n.selected.ellipsis
			)
		);
	} else {
		a.appendChild(document.createTextNode(label));
	}
	
	bindTabToPage(tab, page);
	tab.page.headline = document.createElement("h2");
	tab.page.headline.appendChild(document.createTextNode(label));
	tab.page.appendChild(tab.page.headline);
	return tab;
}

function parseTimestamp(timestamp) {
	var result = new Date;
	result.setUTCFullYear(timestamp.substr(0, 4));
	result.setUTCMonth(timestamp.substr(5, 2));
	result.setUTCDate(timestamp.substr(8, 2));
	result.setUTCHours(timestamp.substr(11, 2));
	result.setUTCMinutes(timestamp.substr(14, 2));
	result.setUTCSeconds(timestamp.substr(17, 2));
	
	function itoa(i, len) {
		var res = i.toString();
		while(res.length < len) {
			res = '0' + res;
		}
		return res;
	}
	
	result.makeSpan = (function(result) {
		return function(date, time) {
			var ins = document.createElement("span");
			ins.setAttribute("class", "timestamp");
			ins.setAttribute("title", result.toLocaleString());
			if(date) {
				var month = document.i18n.selected.months[result.getMonth()];
				ins.appendChild(document.createTextNode(
					result.getDate() + ". " + month + " " + result.getFullYear()
				));
			}
			if(date && time) {
				ins.appendChild(document.createTextNode(", "));
			}
			if(time) {
				ins.appendChild(document.createTextNode(
					itoa(result.getHours(), 2) + ":" +
					itoa(result.getMinutes(), 2)
				));
			}
			return ins;
		};
	})(result);
	
	result.getPlainTimestamp = (function(result) {
		return function() {
			return (
				itoa(result.getFullYear(), 4) +
				itoa(result.getMonth(), 2) +
				itoa(result.getDate(), 2) +
				itoa(result.getHours(), 2) +
				itoa(result.getMinutes(), 2) +
				itoa(result.getSeconds(), 2)
			);
		};
	})(result);
	return result;
}

function iiQuery(server, title, requestid, qcontinue) {
	var query = {
		"action": "query",
		"titles": "File:" + trimFile(title),
		"prop": "imageinfo",
		"meta": "siteinfo",
		"iilimit": 10,
		"iiprop": "user|timestamp|url",
		"iiurlheight": 400,
		"iiurlwidth": 800
	};
	if(qcontinue) {
		for(var i in qcontinue) {
			for(var h in qcontinue[i]) {
				query[h] = qcontinue[i][h];
			}
		}
	}
	return loadFromApi("imageinfoCallback", server, query, requestid);
}

function processDiff(server, li) {
	// alert([li.diff, li.wiki.li.tab.headline]);
	/// TODO: Diff holen und schauen, ob das entsprechende Bild eingefügt wurde
	
	li.spinner.remove();
}

function ucQuery(project, ucuser, ucstart, requestid) {
	return loadFromApi("perWikiCallback", project, {
		"action": "query",
		"list": "usercontribs",
		"ucuser": ucuser,
		"ucstart": ucstart,
		"ucdir": "newer",
		"ucprop": "ids|title|timestamp|comment",
		"meta": "siteinfo"
	}, requestid);
}

function perWikiCallback(json) {
	var wiki = requestList[json.requestid];
	if(!wiki) {
		return;
	}
	if(!wiki.resultOut) {
		wiki.resultOut = document.createElement("ul");
		wiki.appendChild(wiki.resultOut);
	}
	if(json.query.usercontribs) {
		for(var i in json.query.usercontribs) {
			var contrib = json.query.usercontribs[i];
			var li = document.createElement("li");
			li.date = parseTimestamp(contrib.timestamp);
			li.wiki = wiki;
			li.diff = contrib.revid;
			li.spinner = makeSpinner(true);
			li.appendChild(li.spinner);
			var a = document.createElement("a");
			a.setAttribute("href",
				json.query.general.server + json.query.general.script +
				"?title=" + encodeURIComponent(contrib.title) + "&diff=" + contrib.revid
			)
			a.setAttribute("class", "external");
			
			a.appendChild(document.createTextNode(contrib.title));
			li.appendChild(li.date.makeSpan(true, true));
			li.appendChild(document.createTextNode(": "));
			li.appendChild(a);
			if(contrib.comment && contrib.comment.length > 0) {
				var comment = document.createElement("span");
				comment.setAttribute("class", "comment");
				comment.appendChild(document.createTextNode("("));
				comment.appendChild(document.createTextNode(contrib.comment));
				comment.appendChild(document.createTextNode(")"));
				li.appendChild(document.createTextNode(" "));
				li.appendChild(comment);
			}
			wiki.resultOut.appendChild(li);
			processDiff(json.query.general.server, li);
		}
	}
	if(!json["query-continue"]) {
		if(!wiki.resultOut.firstChild) {
			var parentNode = wiki.parentNode;
			parentNode.removeChild(wiki);
			if(!parentNode.firstChild) {
				var empty = document.createElement("li");
				empty.setAttribute("class", "contribsEmpty");
				var a = document.createElement("a");
				a.setAttribute("class", "external");
				a.setAttribute("href", "/~luxo/contributions/contributions.php"
					+ "?lang=" + document.i18n.selected.id
					+ "&user=" + encodeURIComponent(wiki.li.user)
				);
				
				a.appendChild(document.createTextNode(document.i18n.selected.noContributionsAtAll));
				empty.appendChild(a);
				parentNode.appendChild(empty);
			}
		} else {
			var empty = document.createElement("li");
			empty.appendChild(document.createTextNode(document.i18n.selected.contribsEmpty));
			empty.setAttribute("class", "contribsEmpty");
			wiki.resultOut.appendChild(empty);
		}
		delete requestList[json.requestid];
	} else {
		var cont = document.createElement("li");
		cont.setAttribute("class", "contribsContinue");
		var a = document.createElement("a");
		a.setAttribute("href", "#");
		a.onclick = (function(wiki, append, a, project, ucstart) {
			return function() {
				append.parentNode.removeChild(append);
				wiki.spinner = makeSpinner(true);
				wiki.insertBefore(wiki.spinner, wiki.firstChild);
				ucQuery(project, wiki.li.user, ucstart, wiki.requestid);
				return false;
			}
		})(wiki, cont, a, json.query.general.server, json["query-continue"].usercontribs.ucstart);
		a.appendChild(document.createTextNode(document.i18n.selected.contribsContinue));
		cont.appendChild(a);
		wiki.resultOut.appendChild(cont);
	}
	wiki.spinner.remove();
	delete wiki.spinner;
}

function makeUserInfo(user, date, server, script) {
	var userInfo = document.createElement("span");
	userInfo.setAttribute("class", "contributions");
	
	user = encodeURIComponent(user);
	
	var contribUrlPre = server + script + "?title=Special:";
	var contribUrlPost = "Contributions&offset=" + date.getPlainTimestamp() +
		"&target=" + user + "&dir=prev&limit=" + document.i18n.selected.contibutionsLimit;
		
	var contribs = document.createElement("a");
	contribs.setAttribute("class", "external");
	contribs.setAttribute("href", contribUrlPre + contribUrlPost);
	contribs.appendChild(document.createTextNode(document.i18n.selected.contibutions));
	
	var delContribs = document.createElement("a");
	delContribs.setAttribute("class", "external");
	delContribs.setAttribute("href", contribUrlPre + "Deleted" + contribUrlPost);
	delContribs.appendChild(document.createTextNode(document.i18n.selected.deletedContibutions));
	
	var talk = document.createElement("a");
	talk.setAttribute("href", server + script + "?title=User_talk:" + user);
	talk.setAttribute("class", "external");
	talk.appendChild(document.createTextNode(document.i18n.selected.talk));
	
	userInfo.appendChild(document.createTextNode("("));
	userInfo.appendChild(talk);
	userInfo.appendChild(document.createTextNode(" | "));
	userInfo.appendChild(contribs);
	userInfo.appendChild(document.createTextNode(" | "));
	userInfo.appendChild(delContribs);
	userInfo.appendChild(document.createTextNode(")"));
	
	return userInfo;
}

function mkIiExpandFunction(tab, li, a) {
	function perWiki(li, project) {
		var wiki = document.createElement("li");
		var lnk = document.createElement("a");
		lnk.setAttribute("href", "//" + project + "/");
		lnk.setAttribute("class", "external");
		lnk.appendChild(document.createTextNode(project));
		wiki.appendChild(lnk);
		if(tab.isShared) {
			wiki.appendChild(document.createTextNode(" "));
			wiki.appendChild(makeUserInfo(li.user, li.date, "//" + project, "/w/index.php"));
		}
		
		wiki.spinner = makeSpinner(true);
		wiki.insertBefore(wiki.spinner, wiki.firstChild);
		
		li.div.ul.appendChild(wiki);
		
		wiki.li = li;
		wiki.requestid = newRequest(wiki);
		ucQuery(project, li.user, li.timestamp, wiki.requestid);
	}
	
	li.impand = function() {
		var expand = document.createElement("a");
		expand.setAttribute("href", "#");
		expand.onclick = li.expand;
		expand.appendChild(document.createTextNode("[+]"));
		a.parentNode.replaceChild(expand, a);
		a = expand;
		
		li.removeChild(li.div);
		return false;
	};
	
	li.expand = function() {
		var impand = document.createElement("a");
		impand.setAttribute("href", "#");
		impand.onclick = li.impand;
		impand.appendChild(document.createTextNode("[−]"));
		a.parentNode.replaceChild(impand, a);
		a = impand;
		
		if(!li.div) {
			li.div = document.createElement("div");
			li.div.ul = document.createElement("ul");
			perWiki(li, tab.project);
			if(tab.isShared) {
				var wikis = wikilist.value.split("\n");
				var done = {};
				done[tab.project] = true;
				for(var i in wikis) {
					wikis[i] = trim(wikis[i]);
					if(wikis[i] && !done[wikis[i]]) {
						perWiki(li, wikis[i]);
						done[wikis[i]] = true;
					}
				}
			}
			li.div.appendChild(li.div.ul);
		}
		li.appendChild(li.div);
		return false;
	};
	
	return li.expand;
}

function imageinfoCallback(json) {
	var pageId, page;
	var tab = requestList[json.requestid];
	if(!tab) {
		return;
	}
	
	for(pageId in json.query.pages) {
		page = json.query.pages[pageId];
		break;
	}
	if(page.imagerepository === "shared") {
		tab.isShared = true;
		tab.page.appendChild(document.createElement("br"));
		tab.page.appendChild(document.createTextNode(document.i18n.selected.shared));
		iiQuery(document.i18n.selected.sharedRepository, page.title, json.requestid);
		return;
	}
	
	if(!tab.page.thumb) {
		var filename = encodeURIComponent(trimFile(page.title));
		tab.page.thumb = document.createElement("a");
		tab.page.thumb.setAttribute(
			"href", json.query.general.server + json.query.general.script + "?title=File:" + filename
		);
		if(!page.imageinfo || page.imageinfo.length === 0) {
			page.imageinfo = {};
			tab.page.thumb.appendChild(document.createTextNode(document.i18n.selected.fileDoesNotExists));
		} else {
			var img = document.createElement("img");
			img.setAttribute("src", page.imageinfo[0].thumburl);
			img.setAttribute("height", page.imageinfo[0].thumbheight);
			img.setAttribute("width", page.imageinfo[0].thumbwidth);
			img.setAttribute("alt", page.title);
			img.setAttribute("class", "rahmenfarbe1");
			img.style.borderStyle = "solid";
			tab.page.thumb.appendChild(img);
		}
		tab.page.insertBefore(tab.page.thumb, tab.page.list);
	}
	
	for(var upload in page.imageinfo) {
		upload = page.imageinfo[upload];
		var li = document.createElement("li");
		li.tab = tab;
		li.timestamp = upload.timestamp;
		li.date = parseTimestamp(li.timestamp);
		li.user = upload.user;
		
		var aSpan = document.createElement("span");
		aSpan.setAttribute("class", "sans");
		var a = document.createElement("a");
		a.onclick = mkIiExpandFunction(tab, li, a);
		a.setAttribute("href", "#");
		var plus = document.createElement("span");
		a.appendChild(document.createTextNode("[+]"));
		a.setAttribute("title", document.i18n.selected.expand);
		aSpan.appendChild(a);
		li.appendChild(aSpan);
		li.appendChild(document.createTextNode(" "));
		li.appendChild(li.date.makeSpan(true, false));
		li.appendChild(document.createTextNode(": "));
		
		var user = document.createElement("a");
		user.setAttribute("href",
			json.query.general.server + json.query.general.script +
			"?title=User:" + encodeURIComponent(li.user)
		);
		user.setAttribute("class", "external");
		user.appendChild(document.createTextNode(upload.user));
		
		li.appendChild(user);
		li.appendChild(document.createTextNode(" "));
		li.appendChild(makeUserInfo(
			li.user, li.date, json.query.general.server, json.query.general.script
		));
		//if(li.tab.isShared) {
			var span = document.createElement("span");
			span.setAttribute("class", "comment");
			var lnk = document.createElement("a");
			lnk.setAttribute("href", json.query.general.base);
			lnk.setAttribute("class", "external");
			lnk.appendChild(document.createTextNode(trimHTTP(json.query.general.server)));
			
			span.appendChild(document.createTextNode("@ "));
			span.appendChild(lnk);
			li.appendChild(document.createTextNode(" "));
			li.appendChild(span);
		//}
		tab.page.list.appendChild(li);
	}
	
	if(typeof(json["query-continue"]) !== "undefined") {
		iiQuery(document.i18n.selected.sharedRepository, page.title, json.requestid, json["query-continue"]);
	} else {
		tab.removeSpinner();
		tab.makeClosable();
	}
}

function newQuery(filename, project) {
	filename = trimFile(filename);
	project = trimHTTP(project);
	var tab = makeTab(filename);
	tab.filename = filename;
	tab.project = project;
	
	tab.page.list = document.createElement("ul");
	tab.page.appendChild(tab.page.list);
	
	tab.makeSpinner();
	
	tab.show();
	tab.requestid = newRequest(tab);
	tab.onclose = function(tab) {
		delete requestList[tab.requestid];
		return false;
	};
	iiQuery(project, filename, tab.requestid);
	
	return tab;
}

function newQueryClick() {
	var filename = document.getElementById("filename").value;
	var project = document.getElementById("project").value;
	newQuery(filename, project);
	return false;
}

function wikilistCallback(json) {
	if(wikilistDialog) {
		wikilistDialog.removeSpinner();
		wikilistDialog.form.reenable();
		wikilistDialog.makeClosable();
	}
	wikilist.value = json.join("\n") + "\n";
}

function submitWikilist() {
	if(wikilistDialog) {
		wikilistDialog.makeSpinner();
		wikilistDialog.makeUnclosable();
		wikilistDialog.form.onsubmit = function() {
			alert(document.i18n.selected.wl_already_loading);
			return false;
		}
	}
	var url = "./wikilist.php?callback=wikilistCallback";
	for(var i in wikilistOptions) {
		var item = wikilistOptions[i];
		var value;
		var input = wikilistDialog && wikilistDialog.input[item];
		if(input) {
			value = trim(wikilistDialog.input[item].value);
		} else {
			value = document.i18n.selected["wl_" + item + "_default"];
		}
		url += "&" + item + "=" + encodeURIComponent(value);
		document.i18n.selected["wl_" + item + "_default"] = value;
	}
	loadFromScript(url);
	return false;
}

function openWikilistDialog() {
	if(!wikilistDialog) {
		wikilistDialog = makeTab(document.i18n.selected.selectWikis);
		wikilistDialog.onclose = function() {
			wikilistDialog = null;
			return false;
		};
		wikilistDialog.makeClosable();
		wikilistDialog.form = document.createElement("form");
		wikilistDialog.form.reenable = function() {
			wikilistDialog.form.onsubmit = submitWikilist;
		};
		wikilistDialog.form.reenable();
		
		wikilistDialog.input = {};
		for(var i in wikilistOptions) {
			var item = wikilistOptions[i];
			var label = document.createElement("label");
			label.appendChild(document.createTextNode(document.i18n.selected["wl_" + item + "_label"]));
			wikilistDialog.input[item] = document.createElement("input");
			wikilistDialog.input[item].setAttribute("type", "text");
			wikilistDialog.input[item].value = document.i18n.selected["wl_" + item + "_default"];
			label.appendChild(wikilistDialog.input[item]);
			label.appendChild(document.createTextNode(document.i18n.selected["wl_" + item + "_help"]));
			wikilistDialog.form.appendChild(label);
			wikilistDialog.form.appendChild(document.createElement("br"));
		}
		wikilistDialog.form.submitButton = document.createElement("input");
		wikilistDialog.form.submitButton.setAttribute("type", "submit");
		wikilistDialog.form.submitButton.setAttribute.value = document.i18n.selected.wl_submit;
		wikilistDialog.form.appendChild(wikilistDialog.form.submitButton);
		wikilistDialog.page.appendChild(wikilistDialog.form);
		
		wikilistDialog.form.appendChild(document.createElement("br"));
		wikilistDialog.form.appendChild(document.createElement("br"));
		wikilistDialog.form.appendChild(wikilist);
	}
	wikilistDialog.show();
	return false;
}
