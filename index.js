// Question 1 
class Edge {
    constructor(u, v, weight) {
        this.u = u;
        this.v = v;
        this.weight = weight;
    }
}

function prim(edges, numVertices) {
    const adjacencyList = Array.from({ length: numVertices }, () => []);

    edges.forEach(edge => {
        adjacencyList[edge.u].push({ v: edge.v, weight: edge.weight });
        adjacencyList[edge.v].push({ v: edge.u, weight: edge.weight });
    });

    const visited = new Set();
    let minCost = 0;

    visited.add(0);

    const priorityQueue = edges
        .filter(edge => edge.u === 0 || edge.v === 0)
        .map(edge => [edge.weight, edge.u, edge.v]);

    priorityQueue.sort((a, b) => a[0] - b[0]);

    while (priorityQueue.length > 0) {
        const [weight, u, v] = priorityQueue.shift();

        if (!visited.has(v)) {
            visited.add(v);
            minCost += weight;

            for (const { v: neighbor, weight: edgeWeight } of adjacencyList[v]) {
                if (!visited.has(neighbor)) {
                    priorityQueue.push([edgeWeight, v, neighbor]);
                }
            }

            priorityQueue.sort((a, b) => a[0] - b[0]);
        }
    }

    return minCost;
}

// Sample input
const edges = [
    new Edge(0, 1, 4), new Edge(0, 7, 8), new Edge(1, 2, 8),
    new Edge(1, 7, 11), new Edge(2, 3, 7), new Edge(2, 8, 2),
    new Edge(2, 5, 4), new Edge(3, 4, 9), new Edge(3, 5, 14),
    new Edge(4, 5, 10), new Edge(5, 6, 2), new Edge(6, 7, 1),
    new Edge(6, 8, 6), new Edge(7, 8, 7)
];

const numVertices = 9;

const minCost = prim(edges, numVertices);

console.log("Minimum cost to connect all rooms:", minCost);

//_______________________Question 2 ___________________________
function bfsShortestPath(graph, source, target) {
    const queue = [source];
    const visited = new Set([source]);
    const parent = {};

    while (queue.length > 0) {
        const current = queue.shift();

        for (const neighbor of graph[current]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                parent[neighbor] = current;

                if (neighbor === target) {
                    // Found the target, reconstruct the path
                    return reconstructPath(parent, source, target);
                }
            }
        }
    }

    return null;
}

function reconstructPath(parent, source, target) {
    const path = [];
    let current = target;

    while (current !== source) {
        path.unshift(current);
        current = parent[current];
    }

    path.unshift(source);

    return path;
}

// Example usage:
const graph = {
    A: ['B', 'D'],
    B: ['A', 'C', 'E'],
    C: ['B', 'F'],
    D: ['A', 'E'],
    E: ['B', 'D', 'F'],
    F: ['C', 'E'],
};

// Find the shortest path from 'A' to 'F'
const shortestPath = bfsShortestPath(graph, 'A', 'F');

console.log(shortestPath);

//____________________________Question 3____________________________
function dfsAllRoutes(graph, source, target) {
    const visited = new Set();
    const routes = [];

    function dfs(current, path) {
        visited.add(current);

        if (current === target) {
            routes.push([...path, current]);
        } else {
            for (const neighbor of graph[current]) {
                if (!visited.has(neighbor)) {
                    dfs(neighbor, [...path, current]);
                }
            }
        }

        visited.delete(current);
    }

    dfs(source, []);

    return routes;
}

// Example usage:
const graph1 = {
    'CurrentLocation': ['A', 'B'],
    'A': ['C', 'D'],
    'B': ['E'],
    'C': ['F'],
    'D': ['G'],
    'E': ['F', 'G'],
    'F': ['TargetLocation'],
    'G': ['TargetLocation'],
    'TargetLocation': [],
};

const allRoutes = dfsAllRoutes(graph1, 'CurrentLocation', 'TargetLocation');

console.log(allRoutes);

//______________________Question 4 _________________________
class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(item, priority) {
        this.queue.push({ item, priority });
        this.sortQueue();
    }

    dequeue() {
        return this.queue.shift();
    }

    sortQueue() {
        this.queue.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

function dijkstra(graph, start) {
    const distances = {};
    const previous = {};
    const priorityQueue = new PriorityQueue();

    for (const vertex in graph) {
        distances[vertex] = Infinity;
        previous[vertex] = null;
    }

    distances[start] = 0;
    priorityQueue.enqueue(start, 0);

    while (!priorityQueue.isEmpty()) {
        const { item: current, priority: currentDistance } = priorityQueue.dequeue();

        for (const neighbor in graph[current]) {
            const weight = graph[current][neighbor];
            const distance = currentDistance + weight;

            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previous[neighbor] = current;
                priorityQueue.enqueue(neighbor, distance);
            }
        }
    }

    return { distances, previous };
}

// Given graph representation
const graph2 = {
    A: { B: 5, C: 2 },
    B: { D: 4, E: 2 },
    C: { B: 8, E: 7 },
    D: { E: 6, F: 3 },
    E: { F: 1 },
    F: {}
};

// Starting point
const startVertex = 'A';

// Calculate shortest paths
const { distances, previous } = dijkstra(graph2, startVertex);

// Print the shortest paths
for (const vertex in distances) {
    const path = getPath(startVertex, vertex, previous);
    console.log(`Shortest path from ${startVertex} to ${vertex}: ${path.join(' -> ')}, Distance: ${distances[vertex]}`);
}

// Helper function to reconstruct the path
function getPath(start, end, previous) {
    const path = [];
    let current = end;

    while (current !== start) {
        path.unshift(current);
        current = previous[current];
    }

    path.unshift(start);

    return path;
}
