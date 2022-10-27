export default class Graph {
  constructor() {
    this.neighbors = {}; // Key = vertex, value = array of neighbors.
  }

  // Function to form edge between
  // two vertices src and dest

  addEdge(u, v) {
    if (this.neighbors[u] === undefined) {
      // Add the edge u -> v.
      this.neighbors[u] = [];
    }
    this.neighbors[u].push(v);
    if (this.neighbors[v] === undefined) {
      // Also add the edge v -> u in order
      this.neighbors[v] = []; // to implement an undirected graph.
    } // For a directed graph, delete
    this.neighbors[v].push(u); // these four lines.
    //console.log(this.neighbors);
  }
}
