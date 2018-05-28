const fs = require('fs');

const parseNoisesFiles = (content) =>
  content.split(/\n\n/).filter(el => el).map(noise => ({
    class: noise.slice(-1),
    array: noise.split(',').map(number => parseInt(number, 10)),
  }))

const getBiggerSmallerFile = (file1, file2) => {
  const biggerFile = file1.length > file2.length ? file1 : file2;
  const smallerFile = file1.length < file2.length ? file1 : file2;

  return { biggerFile, smallerFile }
}

const compareFiles = (testFile, learnFile) => {
  const semilarClasses = [];
  testFile.map((noise, index) => {
    let minUnSemilarClass = 0;
    let minClassValue = 0;

    learnFile.forEach((learnNoise, learnIndex) => {
      let minUnSemilarClassForObject = 0;

      noise.array.forEach((noiseNumber, key) => {
        if (learnNoise.array[key] !== noiseNumber) {
          minUnSemilarClassForObject += 1;
        }
      })

      if (minUnSemilarClass === 0) {
        minUnSemilarClass = learnNoise.class;
        minClassValue = minUnSemilarClassForObject;
      }

      if (minUnSemilarClassForObject < minClassValue) {
        minUnSemilarClass = learnNoise.class;
        minClassValue = minUnSemilarClassForObject;
      }

      // console.log(noise, learnNoise, minUnSemilarClassForObject, minClassValue)
    })

    semilarClasses[index] = minUnSemilarClass;

  })
  return semilarClasses;
}

const log = (testFile, learnFile) => {
  const compareValues = compareFiles(testFile, learnFile);
  let simmilarCount = 0;
  testFile.map((noise, index) => {
    console.log(`
      ====================================================================
      Test noise object ${noise.array} || Test Class ${noise.class} || New Class ${compareValues[index]}
    `)
    if (noise.class == compareValues[index]) {
      simmilarCount += 1;
    }
  })
  console.log('Simmilar percent: ', (simmilarCount / (testFile.length / 100)))
}

const text1 = fs.readFileSync('./noises1.txt', 'utf8');
const text11 = fs.readFileSync('./noises11.txt', 'utf8');

console.log('Noise 0.1:\n\n')

log(parseNoisesFiles(text1), parseNoisesFiles(text11))

// const text2 = fs.readFileSync('./noises2.txt', 'utf8');
// const text22 = fs.readFileSync('./noises22.txt', 'utf8');
//
// console.log('Noise 0.2:\n\n')
//
// log(parseNoisesFiles(text2), parseNoisesFiles(text22))
//
// const text3 = fs.readFileSync('./noises3.txt', 'utf8');
// const text33 = fs.readFileSync('./noises33.txt', 'utf8');
//
// console.log('Noise 0.3:\n\n')
//
// log(parseNoisesFiles(text3), parseNoisesFiles(text33))
