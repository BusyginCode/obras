const fs = require('fs');
const async = require('async');
const rl = require("readline");
const clusterMaker = require('./clusters');

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

const logClusters = (clusters) => {
  clusters.map((cluster, index) => {
    const roundCluster = cluster.centroid.map((c) => Math.round(c))
    console.log(`\n${index + 1}) Cluster\n   Centroid: ${cluster.centroid} \n   Median: ${roundCluster}\n`)
    console.log(`   ${roundCluster.slice(0, 3)}\n   ${roundCluster.slice(3, 6)}\n   ${roundCluster.slice(6, 9)}\n   ${roundCluster.slice(9)}`)
    console.log(`\n   Points:\n`)
    log(cluster.points)
  })
}

const prompts = rl.createInterface(process.stdin, process.stdout);
let data;

async.series([
  (callback) => {
    prompts.question("Enter file id(44): ", (fileId) => {
      data = parseNoisesFiles(fs.readFileSync(`./noises${fileId || 44}.txt`, 'utf8'));
      console.log('\nDefault noises file:\n')
      log(data)
      console.log('\n')
      callback();
    })
  },
  () => {
    prompts.question("Enter clusters count(3): ", (clustersCount) => {
      prompts.question("Enter iterations count(100): ", (iterationsCount) => {
        console.log('\nClusters:\n')
        clusterMaker.k(parseInt(clustersCount, 10) || 3);
        clusterMaker.iterations(parseInt(iterationsCount, 10) || 100);
        clusterMaker.data(data);
        logClusters(clusterMaker.clusters());
        prompts.close();
      });
    });
  }
]);
