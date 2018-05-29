

/*
  * ===============================================================
  * classes
  * ===============================================================
*/
class Point {
  constructor(location, pointClass) {
    this.location = getterSetter(location);
    this.label = getterSetter();
    this.class = getterSetter(pointClass);
  }

  updateLabel(centroids) {
    const distancesSquared = centroids.map((centroid) =>
      sumOfSquareDiffs(this.location(), centroid.location())
    );
    this.label(mindex(distancesSquared));
  }
};

class Centroid {
  constructor(initialLocation, label) {
    this.location = getterSetter(initialLocation);
    this.label = getterSetter(label);
  }

  updateLocation(points) {
    const pointsWithThisCentroid = points.filter((point) => point.label() === this.label());
    if (pointsWithThisCentroid.length > 0) this.location(averageLocation(pointsWithThisCentroid));
  }
}


/*
  * ===============================================================
  * utils
  * ===============================================================
*/
const getterSetter = (initialValue, validator, isClustersData) => {
  let thingToGetSet = initialValue;
  const isValid = validator || ((val) => true);
  return (newValue) => {
    if (typeof newValue === 'undefined') return thingToGetSet;
    if (isValid(newValue)) thingToGetSet = newValue;
  };
};

const sumOfSquareDiffs = (oneVector, anotherVector) => {
  const squareDiffs = oneVector.map((component, i) => Math.pow(component - anotherVector[i], 2));
  return squareDiffs.reduce((a, b) => a + b, 0);
};

const mindex = (array) => {
  const min = array.reduce((a, b) => Math.min(a, b));
  return array.indexOf(min);
};

const sumVectors = (a, b) => a.map((val, i) => val + b[i]);

const averageLocation = (points) => {
  const zeroVector = points[0].location().map(() => 0);
  const locations = points.map((point) => point.location());
  const vectorSum = locations.reduce((a, b) => sumVectors(a, b), zeroVector);
  return vectorSum.map((val) => val / points.length);
};


/*
  * ===============================================================
  * main method
  * ===============================================================
*/
const kmeans = (data, config) => {
  const k = config.k || Math.round(Math.sqrt(data.length / 2));
  const iterations = config.iterations;

  // initialize point objects with data
  const points = data.map((elem) => new Point(elem.location, elem.class));

  // intialize centroids randomly
  const centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(new Centroid(points[i % points.length].location(), i));
  };

  // update labels and centroid locations until convergence
  for (let iter = 0; iter < iterations; iter++) {
    points.forEach((point) => point.updateLabel(centroids));
    centroids.forEach((centroid) => centroid.updateLocation(points));
  };

  return { points, centroids };
};


/*
  * ===============================================================
  * export API
  * ===============================================================
*/
module.exports = {

  data: getterSetter([], arrayOfArrays =>
    arrayOfArrays.map(array => array.length == arrayOfArrays[0].length)
      .reduce((boolA, boolB) => boolA & boolB, true)
  , true),

  clusters: function() {
    const pointsAndCentroids = kmeans(this.data(), { k: this.k(), iterations: this.iterations() });
    const points = pointsAndCentroids.points;
    const centroids = pointsAndCentroids.centroids;

    return centroids.map((centroid) => ({
      centroid: centroid.location(),
      points: points
        .filter((point) => point.label() === centroid.label())
        .map((point) => ({ location: point.location(), class: point.class() })),
    }));
  },

  k: getterSetter(undefined, (value) => ((value % 1 == 0) & (value > 0))),

  iterations: getterSetter(Math.pow(10, 3), (value) => ((value % 1 == 0) & (value > 0))),
};
