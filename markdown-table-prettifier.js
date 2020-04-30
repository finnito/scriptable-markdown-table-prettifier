/**
 * Author: Finn Le Sueur
 * Website: https://finn.lesueur.nz
 * Gitlab: https://gitlab.com/Finnito/scriptable-markdown-table-prettifier
 *
 * This is the raw script that goes into
 * the Scriptable action so that it can
 * be run from the share sheet.
 **/

 /*global Script Pasteboard args */

function formatTables(lines, tableIndices) {
    'use strict';
    var i,
        j,
        k,
        columnSizes = [],
        tr,
        td,
        firstSplitLine,
        numColumns,
        splitLine;

    // Iterate each table indices
    for (i = 0; i < tableIndices.length; i += 1) {

        // Iterate the lines for each table
        firstSplitLine = lines[tableIndices[i][0]].split("|");
        numColumns = firstSplitLine.slice(1, firstSplitLine.length - 1).length;
        columnSizes = Array.apply(null, new Array(numColumns)).map(Number.prototype.valueOf, 0);
        for (j = tableIndices[i][0]; j <= tableIndices[i][1]; j += 1) {

            // Find out how many columns there are
            splitLine = lines[j].split("|");
            splitLine = splitLine.slice(1, splitLine.length - 1);
            // Find the largest size of each column
            for (k = 0; k < splitLine.length; k += 1) {
                td = splitLine[k].trim();
                if (td[0] !== "-") {
                    if (td.length > columnSizes[k]) {
                        columnSizes[k] = td.length;
                    }
                }
            }
        }

        // Pad out the cells
        for (j = tableIndices[i][0]; j <= tableIndices[i][1]; j += 1) {
            // Find out how many columns there are
            splitLine = lines[j].split("|");
            splitLine = splitLine.slice(1, splitLine.length - 1);
            // Find the largest size of each column
            tr = "|";
            for (k = 0; k < splitLine.length; k += 1) {
                td = splitLine[k].trim();
                if (td[0] !== "-") {
                    tr += " ";
                    tr += td;
                    tr += " ".repeat(columnSizes[k] - td.length);
                    tr += " |";
                } else {
                    tr += "-".repeat(columnSizes[k] + 2);
                    tr += "|";
                }
            }
            lines[j] = tr;
        }
    }
    return lines;
}

function findTables(lines) {
    'use strict';
    var i,
        tables = [],
        tableStart = false,
        tableEnd = false;
    for (i = 0; i < lines.length; i += 1) {
        if (lines[i][0] === "|") {
            if (!tableStart) {
                tableStart = i;
            }
        }
        if ((lines[i] === "") && (tableStart !== false)) {
            tableEnd = i - 1;
            tables.push([tableStart, tableEnd]);
            tableStart = false;
            tableEnd = false;
        }
    }
    return tables;
}

function main() {
    'use strict';
    var text = args.plainTexts[0];
    var lines = text.split("\n");
    var tableIndices = findTables(lines);
    lines = formatTables(lines, tableIndices);
    Pasteboard.copy(lines.join("\n"));
    Script.complete();
}

main();