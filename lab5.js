const fs = require('fs');
// const kMeans = require('kmeans-js')
const clusterMaker = require('clusters');

const parseNoisesFiles = (content) =>
  content.split(/\n\n/).filter(el => el).map(noise => ({
    class: noise.slice(-1),
    array: noise.split(',').map(number => parseInt(number, 10)),
  }))

const log = (testFile) => {
  testFile.map((noise, index) => {
    console.log(`
      ====================================================================
      Test noise object ${noise.array} || Test Class ${noise.class}
    `)
  })
}

const text1 = fs.readFileSync('./noises44.txt', 'utf8');

log(parseNoisesFiles(text1))

const data = parseNoisesFiles(text1).map((n) => n.array);
// const classes = parseNoisesFiles(text1).map((n) => n.class)

console.log(data)
console.log('\n\n')

//number of clusters, defaults to undefined
clusterMaker.k(3);

//number of iterations (higher number gives more time to converge), defaults to 1000
clusterMaker.iterations(750);

//data from which to identify clusters, defaults to []
clusterMaker.data(data);

console.log(clusterMaker.clusters());



// var km = new kMeans({
//     K: 3
// });
//
// km.cluster(data);
// while (km.step()) {
//     km.findClosestCentroids();
//     km.moveCentroids();
//
//     console.log('\ncallback centroids ', km.centroids);
//
//     if(km.hasConverged()) break;
// }
//
// console.log('Finished in:', km.currentIteration, ' iterations \n\n');
// console.log(km.centroids, '\n\n' ,km.clusters);
