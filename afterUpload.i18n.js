/*
 *  afterUpload ­– lets you inspect edits a user did after uploading an image
 *  Copyright (C) 2009-2018 René Kijewski  rene <dot> <surname> <at> fu–berlin <dot> de
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
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

document.i18n = {};

/// TODO: document.i18n.xx.months → function makedate()

document.i18n.de = {
	"id": "de",
	"language": "Sprache: Deutsch",
	"maxLabelLength": 16,
	"sharedRepository": "commons.wikimedia.org",
	
	"months": [
		"Jan.", "Feb.", "März", "Apr.", "Mai",  "Juni",
		"Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."
	],
	"closeText": "schließen",
	"shared": "Diese Datei liegt auf WikiMedia Commons.",
	"fileDoesNotExists": "Die Datei existiert nicht …",
	"loadingText": "läd …",
	"loadingGifHref": "https://de.wikipedia.org/wiki/Datei:Loader3.gif",
	"loadingGifName": "Datei:Loader3.gif",
	"loadingGifFile": "https://upload.wikimedia.org/wikipedia/commons/3/32/Loader3.gif",
	"loadingGifSmallHeight": "18px",
	"loadingGifSmallWidth": "18px",
	"expand": "aufklappen",
	"ellipsis": "…",
	"newQueryLabel": "Neue Abfrage",
	"filenameLabel": "Dateiname:",
	"projectLabel": "Projekt:",
	"filename": "Beispiel.jpg",
	"project": "de.wikipedia.org",
	"query": "abfragen",
	"L10n": "Wähle deine Sprache",
	"select": "auswählen",
	"selectWikis": "abzufragende Wikis auswählen",
	"contribsEmpty": "keine neueren Beiträge",
	"noContributionsAtAll": "Der Benutzer hat in keinen der ausgewählten Projekte Beiträge gemacht.",
	"contribsContinue": "neuere Beiträge",
	"contibutionsLimit": 10,
	"contibutions": "Beiträge",
	"deletedContibutions": "gelöschte Beiträge",
	"talk": "Diskussion",
	"selectedLanguageNotSupported": "Die ausgewählte Sprache wird nicht unterstützt/ist unbekannt.",
	
	"wl_size_label": "Minimum an Artikeln: ",
	"wl_family_label": "Projektfamilie: ",
	"wl_lang_label": "Sprachcode: ",
	"wl_limit_label": "Höchstens: ",
	"wl_size_default": "",
	"wl_family_default": "wikipedia",
	"wl_lang_default": "",
	"wl_limit_default": "10",
	"wl_size_help": " (z. B. 100000)",
	"wl_family_help": " (wikipedia, commons, wiktionary, …)",
	"wl_lang_help": " (de, en, fr, …)",
	"wl_limit_help": " (absteigend sortiert nach Artikelanzahl)",
	"wl_submit": "auswählen",
	"wl_already_loading": "Bitte habe Geduld! Die Wikiliste wird bereits geladen.",
	"wl_empty": "Bitte wähle zuerst die entsprechenden Wikis aus.",
	"wl_default": "de.wikipedia.org\nen.wikipedia.org\n",
	"wl_cols": 40,
	"wl_rows": 20
};

document.i18n.en = {
	"id": "en",
	"language": "Language: English",
	"maxLabelLength": 16,
	"sharedRepository": "commons.wikimedia.org",
	
	"months": [
		"jan.", "feb.", "mar.", "apr.", "may",  "june",
		"july", "aug.", "sep.", "oct.", "nov.", "dec."
	],
	"closeText": "close",
	"shared": "This file was uploaded to WikiMedia Commons.",
	"loadingText": "loading …",
	"fileDoesNotExists": "The file does not exist …",
	"loadingGifHref": "https://en.wikipedia.org/wiki/File:Loader3.gif",
	"loadingGifName": "File:Loader3.gif",
	"loadingGifFile": "https://upload.wikimedia.org/wikipedia/commons/3/32/Loader3.gif",
	"loadingGifSmallHeight": "16px",
	"loadingGifSmallWidth": "16px",
	"expand": "expand",
	"ellipsis": "...",
	"newQueryLabel": "New query",
	"filenameLabel": "filename:",
	"projectLabel": "project:",
	"filename": "Example.jpg",
	"project": "en.wikipedia.org",
	"query": "query",
	"L10n": "Select your language",
	"select": "select",
	"selectWikis": "Select wikis to query",
	"contribsEmpty": "no more recent contributions",
	"noContributionsAtAll": "The user did not do any contibutions to any of the selected projects.",
	"contribsContinue": "newer contributions",
	"contibutionsLimit": 10,
	"contibutions": "contibutions",
	"deletedContibutions": "deleted contibutions",
	"talk": "talk",
	"selectedLanguageNotSupported": "The selected language is not supported or unknown.",
	
	"wl_size_label": "Minimum article count: ",
	"wl_family_label": "Project family: ",
	"wl_lang_label": "Language code: ",
	"wl_limit_label": "At most: ",
	"wl_size_default": "",
	"wl_family_default": "wikipedia",
	"wl_lang_default": "",
	"wl_limit_default": "10",
	"wl_size_help": " (e.g. 100000)",
	"wl_family_help": " (wikipedia, commons, wiktionary, … )",
	"wl_lang_help": " (en, de, fr, …)",
	"wl_limit_help": " (ordered by number of articles, descending)",
	"wl_submit": "select",
	"wl_already_loading": "Please have patience! The wikilist is being fetched.",
	"wl_empty": "Please select your wikis first.",
	"wl_default": "en.wikipedia.org\nde.wikipedia.org\n",
	"wl_cols": 40,
	"wl_rows": 20
};
