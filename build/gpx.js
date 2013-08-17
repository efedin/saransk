(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"pict": "images/number_{number}.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong>УИК {number}</strong><br/>{obj}. {addr}, тел. {phone}"
	},
	{
		"type": "ТИКи",
		"pict": "images/symbol_sum.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong>ТИК <a href='{url}'>{name}</a></strong><br/>{desc}"
	}
];

var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
function getHTTPObject() {
	if (typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0"];
		for (var i = 0; i < versions.length; i++) {
			try {
				var oXmlHttp = new ActiveXObject(versions[i]);
				return oXmlHttp;
			} catch (err) {}
		}
	}
}
var xhr = getHTTPObject();
xhr.open("GET", "../iks.json", true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200 || xhr.status == 304) {
			var iks = JSON.parse(xhr.responseText);
			ikData[0].data = iks.uiks;
			ikData[1].data = iks.tiks;
			printGpx();
		}
	}
};
xhr.send(null);
function printGpx() {
	var txt, cur;
	txt = '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="simple script"><metadata><name>Переславль-Залесский. 2012</name></metadata>';
	for (var i = 0; i < ikData.length; i++) {
		for (var j = 0; j < ikData[i].data.length; j++) {
			cur = ikData[i].data[j];
			txt += '<wpt lat="' + cur.lat + '" lon="' + cur.lon + '"><name>' + ikData[i].type.substring(0, 3) + (cur.number?' '+cur.number:'') + '</name><cmt>' + (cur.desc||cur.addr) + '</cmt><type>' + ikData[i].type.substring(0, 3) + '</type></wpt>';
		}
	}
	txt += '</gpx>';
	var newEl = document.createElement('div');
	newEl.appendChild(document.createTextNode(txt));
	document.body.appendChild(newEl);
}
})();
