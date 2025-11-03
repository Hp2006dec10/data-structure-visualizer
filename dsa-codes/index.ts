export const STACK_CODE = `
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """Add an item to the top of the stack"""
        self.items.append(item)
        return f"Pushed {item} to stack"
    
    def pop(self):
        """Remove and return the item from the top of the stack"""
        if self.is_empty():
            return None
        return self.items.pop()
    
    def peek(self):
        """Return the top item without removing it"""
        if self.is_empty():
            return None
        return self.items[-1]
    
    def is_empty(self):
        """Check if the stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return the size of the stack"""
        return len(self.items)
    
    def clear(self):
        """Clear all items from the stack"""
        self.items.clear()
        return "Stack cleared"`;

export const QUEUE_CODE = `
class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        """Add an item to the rear of the queue"""
        self.items.append(item)
        return f"Enqueued {item}"
    
    def dequeue(self):
        """Remove and return the item from the front of the queue"""
        if self.is_empty():
            return None
        return self.items.pop(0)
    
    def front(self):
        """Return the front item without removing it"""
        if self.is_empty():
            return None
        return self.items[0]
    
    def is_empty(self):
        """Check if the queue is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return the size of the queue"""
        return len(self.items)
    
    def clear(self):
        """Clear all items from the queue"""
        self.items.clear()
        return "Queue cleared"`;

export const LINKED_LIST_CODE = `
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add a node at the end"""
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data):
        """Add a node at the beginning"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        """Delete a node with given data"""
        if self.head is None:
            return None
        if self.head.data == data:
            self.head = self.head.next
            return data
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return data
            current = current.next
        return None
    
    def display(self):
        """Display all nodes"""
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements`;

export const ARRAY_CODE = `
class Array:
    def __init__(self):
        self.items = []
    
    def append(self, item):
        """Add an item at the end"""
        self.items.append(item)
        return f"Appended {item}"
    
    def insert(self, index, item):
        """Insert item at index"""
        if 0 <= index <= len(self.items):
            self.items.insert(index, item)
            return f"Inserted {item} at index {index}"
        return "Invalid index"
    
    def remove(self, item):
        """Remove first occurrence of item"""
        if item in self.items:
            self.items.remove(item)
            return f"Removed {item}"
        return "Item not found"
    
    def pop(self, index=-1):
        """Remove and return item at index"""
        if self.is_empty():
            return None
        return self.items.pop(index)
    
    def is_empty(self):
        """Check if array is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return size of array"""
        return len(self.items)`;

export const HASH_TABLE_CODE = `
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def hash_function(self, key):
        """Generate hash for key"""
        return hash(key) % self.size
    
    def insert(self, key, value):
        """Insert key-value pair"""
        hash_index = self.hash_function(key)
        for pair in self.table[hash_index]:
            if pair[0] == key:
                pair[1] = value
                return f"Updated {key}"
        self.table[hash_index].append([key, value])
        return f"Inserted {key}"
    
    def get(self, key):
        """Get value by key"""
        hash_index = self.hash_function(key)
        for pair in self.table[hash_index]:
            if pair[0] == key:
                return pair[1]
        return None
    
    def delete(self, key):
        """Delete key-value pair"""
        hash_index = self.hash_function(key)
        for i, pair in enumerate(self.table[hash_index]):
            if pair[0] == key:
                del self.table[hash_index][i]
                return f"Deleted {key}"
        return None`;

export const BINARY_SEARCH_TREE_CODE = `
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, data):
        """Insert node maintaining BST property"""
        if self.root is None:
            self.root = TreeNode(data)
            return f"Inserted {data} as root"
        return self._insert_recursive(self.root, data)
    
    def _insert_recursive(self, node, data):
        """Helper method to insert recursively"""
        if data < node.data:
            if node.left is None:
                node.left = TreeNode(data)
                return f"Inserted {data}"
            return self._insert_recursive(node.left, data)
        elif data > node.data:
            if node.right is None:
                node.right = TreeNode(data)
                return f"Inserted {data}"
            return self._insert_recursive(node.right, data)
        else:
            return f"{data} already exists"`;

export const GRAPH_CODE = `class Graph:
    def __init__(self):
        self.vertices = {}
        self.edges = []
    
    def add_vertex(self, vertex):
        """Add a vertex to the graph"""
        if vertex not in self.vertices:
            self.vertices[vertex] = []
            return f"Added vertex {vertex}"
        return "Vertex already exists"
    
    def add_edge(self, v1, v2):
        """Add an edge between two vertices"""
        if v1 in self.vertices and v2 in self.vertices:
            self.vertices[v1].append(v2)
            self.vertices[v2].append(v1)
            self.edges.append((v1, v2))
            return f"Added edge ({v1}, {v2})"
        return "Invalid vertices"
    
    def remove_edge(self, v1, v2):
        """Remove an edge between two vertices"""
        if v1 in self.vertices and v2 in self.vertices:
            if v2 in self.vertices[v1]:
                self.vertices[v1].remove(v2)
                self.vertices[v2].remove(v1)
                if (v1, v2) in self.edges:
                    self.edges.remove((v1, v2))
                return f"Removed edge ({v1}, {v2})"
        return "Edge not found"
    
    def get_neighbors(self, vertex):
        """Get neighbors of a vertex"""
        return self.vertices.get(vertex, [])`;

