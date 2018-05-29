const fs = require('fs');
const rl = require("readline");

const firstSymbol = 2;
const secondSymbol = 0;
const thirdSymbol = 1;

const firstSymbolArray = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1]; // 2

const secondSymbolArray = [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0]; // 0;

const thirdSymbolArray = [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0]; // 1

let allNoisesStash = [];

const random = (min = 0, max = 1) =>
  Math.random() * (max - min) + min;

const logSymbolArray = (array, title) => {
  console.log(`\n${title} Symbol: `)
  console.log(` ${array.slice(0, 3)}\n ${array.slice(3, 6)}\n ${array.slice(6, 9)}\n ${array.slice(9, 12)}`)
}

const getNoiseExamplars = (count, symbolArray, symbol, threshold) => {
  const allNoisesArray = [];
  let noiseArray;
  for (let i = 0; i < count; i++) {
    noiseArray = [].concat(symbolArray);
    for (let j = 0; j < noiseArray.length; j++) {
      if (random() < (threshold || 0.1)) {
        if (noiseArray[j] === 0) {
          noiseArray[j] = 1;
        } else {
          noiseArray[j] = 0;
        }
      }
    }
    noiseArray[noiseArray.length] = symbol;
    allNoisesArray.push(noiseArray)
  }
  return allNoisesArray;
}

const writeToFile = (noises, fileId) => {
  let fileContentString = '';
  noises.forEach(noise => {
    fileContentString += `${noise.slice(0, -1)} - ${noise.slice(-1)}\n\n`;
  })
  fs.writeFile(`./noises${fileId || 55}.txt`, fileContentString, (err) => {
    if (err) return console.log(err);
    console.log("The file was saved!");
  });
}

const compareRandom = () => Math.random() - 0.5;

const pushToNoisesStash = (count, firstSymbolArray, firstSymbol, threshold) => {
  const noises = getNoiseExamplars(
    parseInt(count, 10) || 0,
    firstSymbolArray,
    firstSymbol,
    parseFloat(threshold, 10)
  );
  allNoisesStash = allNoisesStash.concat(noises);
}


/* === Main === */

logSymbolArray(firstSymbolArray, 'First');
logSymbolArray(secondSymbolArray, 'Second');
logSymbolArray(thirdSymbolArray, 'Third');
console.log('\n\n');

let prompts = rl.createInterface(process.stdin, process.stdout);

prompts.question("Enter noise threshold(0.1): ", (threshold) => {

  prompts.question("Enter noise exemplars count for first symbol(2): ", (count) => {
    pushToNoisesStash(count, firstSymbolArray, firstSymbol, threshold);

    prompts.question("Enter noise exemplars count for second symbol(0): ", (count) => {
      pushToNoisesStash(count, secondSymbolArray, secondSymbol, threshold);

      prompts.question("Enter noise exemplars count for third symbol(1): ", (count) => {
        pushToNoisesStash(count, thirdSymbolArray, thirdSymbol, threshold);

        prompts.question("Enter fileId(55): ", (fileId) => {
          writeToFile(allNoisesStash.sort(compareRandom), fileId)
          prompts.close();
        });
      });

    });

  });

});
