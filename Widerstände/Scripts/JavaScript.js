let widerstand = [];

const leitwert = { "Silber": 60.6, "Kupfer": 56.8, "Aluminium": 36, "Messing": 13.3 };

const storageName = "widerständeStorge";
const configStorageName = "configStorge";

const durchmesserStartwert = 0.5;
const durchmesserMax = 1.0;

let config = new Object();
config.startwert = 1;
config.endwert = 10;
config.schrittweite = 1;
config.leitwert = leitwert.Silber;

$(document).ready(function ()
{
    "use strict";

    $("#tabelleAusgabe").hide();

    LeitwerteErzeugen();

    configAnzeigen();

    $("#buttonBerechnen").on("click", function ()
    {
        configSpeichern();

        widerstandsBerechnung();

        tabellenAusgabe();
    });

    $("#buttonSpeichern").on("click", function ()
    {
        configSpeichern();

        localStorage.setItem(configStorageName, JSON.stringify(config));

        localStorage.setItem(storageName, JSON.stringify(widerstand));
    });

    $("#buttonLaden").on("click", function ()
    {
        if (localStorage.length === 2)
        {
            widerstand = JSON.parse(localStorage.getItem(storageName));

            config = JSON.parse(localStorage.getItem(configStorageName));            

            configAnzeigen();

            tabellenAusgabe();
        }
    });
});

function LeitwerteErzeugen()
{
    "use strict";
    for (let k in leitwert)
    {
        let option = '<option value="' + leitwert[k] + '">' + k + '</option>';
        $("#leitwerte").append(option);
    }
}


function configSpeichern()
{
    "use strict";
    config.startwert = parseInt($("#startwert").val());
    config.endwert = parseInt($("#endwert").val());
    config.schrittweite = parseFloat($("#schrittweite").val());
    config.leitwert = parseFloat($("#leitwerte").val());
}

function configAnzeigen() {
    "use strict";
    $("#startwert").val(config.startwert);
    $("#endwert").val(config.endwert);
    $("#schrittweite").val(config.schrittweite);
    $("#leitwerte").val(config.leitwert);
}

function widerstandsBerechnung()
{
    "use strict";
    let spalte = 0;

    widerstand = [];

    let index = 0;

    for (let l = config.startwert; l <= config.endwert; l += config.schrittweite)
    {
        widerstand[index] = [];

        for (let d = durchmesserStartwert; d <= durchmesserMax; d += 0.1)
        {
            let A = Math.PI * (d * d) / 4;
            let r = l / (config.leitwert * A);
            widerstand[index][spalte] = r;
            spalte++;
        }
        index++;
        spalte = 0;
    }
}

function tabellenAusgabe()
{
    "use strict";
    $("#tabelleAusgabe").show();

    $("#tabelleAusgabe tr").remove();

    tabellenKopf();

    for (let i = 0; i < widerstand.length; i++)
    {
        let zeile = "<tr>";

        zeile += "<td>" + (i + 1) * config.schrittweite + " m </td>";

        for (let j = 0; j < widerstand[i].length; j++)
        {
            zeile += "<td>" + widerstand[i][j].toFixed(3) + "</td>";
        }
        zeile += "</tr>";

        $("#tabelleAusgabe").append(zeile);
    }
}

function tabellenKopf()
{
    "use strict";
    let zeile = "<tr><th> l/d </th>";

    for (let i = durchmesserStartwert; i <= durchmesserMax; i += 0.1)
    {
        zeile += "<th>" + i.toFixed(1) + " mm </th>";
    }

    zeile += "</tr>";

    $("#tabelleAusgabe").append(zeile);
}