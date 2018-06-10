const fs = require('fs');
const async = require('async');
const rl = require("readline");
const _ = require('underscore-node');

let data;

const parseNoisesFiles = (content) =>
  content.split(/\n\n/).filter(el => el).map(noise => ({
    class: noise.slice(-1),
    location: noise.split(',').map(number => parseInt(number, 10)),
  }))

const log = (points) => {
  points.map((point, index) => {
    console.log(`     ----------------------------------------------------
     | Noise object: ${point.location} | Class: ${point.class} |`
    )
  })
  console.log('     ----------------------------------------------------')
}

const getGroups = () => {
  const groups = _.groupBy(data, 'class');

  return Object.keys(groups).map((classKey) => ({
    class: classKey,
    matrix: groups[classKey].map((group) => group.location)
  }));
}

const excludeItemArray = (array, index) =>
  array.slice(0, index).concat(array.slice(index + 1))

const getAllVotes = (matrix, excludeAttributeIndex = undefined) => {
  let votesCount = 0;
  matrix.slice(0, -1).forEach((obj, index) =>
    matrix.slice(index + 1).forEach((nextObj) => {
      let finalObj = obj;
      let finalNextObj = nextObj;

      if (excludeAttributeIndex !== undefined) {
        finalObj = excludeItemArray(obj, excludeAttributeIndex);
        finalNextObj = excludeItemArray(nextObj, excludeAttributeIndex)
      }

      finalObj.forEach((attribute, i) => {
        if (attribute === finalNextObj[i]) { votesCount += 1 }
      })
    })
  )

  return votesCount;
}

const getAttributesVotes = (matrix) =>
  matrix[0].map((o, i) => getAllVotes(matrix, i))

const logValueOfEachAttribute = (classes) => {
  classes[Object.keys(classes)[0]].attributesVotes.forEach((oneAtr, index) => {
    let res = 0;
    let logString = `C${index + 1} = `;

    Object.keys(classes).forEach((classKey, classIndex) => {
      const votes = classes[classKey].allVotes;
      const attrVote = classes[classKey].attributesVotes[index];

      res += votes - attrVote;
      logString += `(${votes} - ${attrVote})${classIndex !== Object.keys(classes).length - 1 ? ' + ' : ''}`
    })

    console.log(`${logString} = ${res}`)
  })
}



/* =========== Main ============*/


const prompts = rl.createInterface(process.stdin, process.stdout);

async.series([
  (callback) => {
    prompts.question("Enter file id(44): ", (fileId) => {
      data = parseNoisesFiles(fs.readFileSync(`./noises${fileId || 44}.txt`, 'utf8'));
      console.log('\nDefault noises file:\n');
      log(data);
      console.log('\n');
      callback();
    })
  },
  () => {
    const groups = getGroups();
    const classes = {};

    groups.forEach((group, i) => {
      const matrix = group.matrix;
      console.log(`Class: ${group.class}\nMatrix:`);
      matrix.forEach((loc) => console.log(loc));

      const allVotes = getAllVotes(matrix);
      console.log('All Votes =', allVotes);

      const attributesVotes = getAttributesVotes(matrix);
      console.log('Attribute Votes =', attributesVotes, '\n');

      classes[group.class] = { allVotes, attributesVotes }
    })

    logValueOfEachAttribute(classes)

    prompts.close();
  }
]);
