var fs = require('fs');

// TODO: oop refactoring: use classes
function print(msg) {
  process.stdout.write(msg);
}

function printbk(msg) {
  print(msg + '\r');
}


function println(msg) {
  print(msg + '\n');
}

function clearln() {
  process.stdout.clearLine();
}

function errorout(err) {
  console.error('ERROR: ', err);
}


String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class Spinner {
  constructor() {
    this.chars = '|/-\\';
    this.pos = 0;
  }

  next() {
    this.pos++;
    if (this.pos >= this.chars.length) {
      this.pos = 0;
    }
    return this.chars[this.pos];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- starting point

async function doit() {

  try {

    var folder = process.argv[2];
    if (!folder) {
      throw Error('Folder parameter is not set!');
    }
    var template = process.argv[3];
    if (!template) {
      throw Error('Template file as a parameter is not set!');
    }

    println('Processing svg files from folder `' + folder + '` into angular component template: ' + template + '\r\n');

    if (fs.existsSync(template)) {
      println(template + ' file already exists, making a backup..');
      fs.copyFileSync(template, template + '.bak');
      fs.unlinkSync(template);
    }
    files = fs.readdirSync(folder);

    spinner = new Spinner();
    for (var i = 0; i < files.length; i++) {
      clearln();
      printbk('Processing files (' + (i + 1) + '/' + files.length + '): [' + spinner.next() + '] ' + files[i]);
      var cnt =
        '\n<ng-template [ngIf]="file==\'' + files[i] + '\'">\n' +
        (fs.readFileSync(folder + files[i], 'utf-8')
            .replace(/^\s*\<\?xml\s+(.*)\?\>/i, '')
            .replaceAll(/\s+id\s*\=\s*\"/i, ' class="')
            .replaceAll(/<style[\s+>](.|\n|\r)*<\/style>/i, '')
            .replaceAll(/<title[\s+>](.|\n|\r)*<\/title>/i, '')
            .replaceAll(/<desc[\s+>](.|\n|\r)*<\/desc>/i, '')
        ) +
        '\n</ng-template>\n';
      fs.appendFileSync(template, cnt);
      // await sleep(100);
    }
    clearln();
    println('Template created.\nDone.\n');

  } catch (err) {
    errorout(err);
  }


}

doit();
