(function (root) {
	var Trieforce = root.Trieforce = (root.Trieforce || {});

	var Trie = Trieforce.Trie = function (entry, options) {
		//Trie handles all TrieNodes and keeps track of their roots
		this.roots = {};

		//entry can be a string, or array of strings
		if (typeof entry === 'string') {
			this.add(entry);
		} else {
			//entry is an object; assume an array of strings
			entry.forEach(function (string) {
				this.add(string);
			});
		}
	};

	Trie.prototype.add = function (entry) {
		//adds entry to correct root node, or creates
		// new node if no such root exists
		var root = this.findRoot(entry);

		if (root !== false) {
			//root is found, find the last subnode possible
			// and grow from there
			var trace = this.traceQuery(entry)
			var notYetAdded = entry.slice(trace.value.length);

			if (notYetAdded.length == 0) {
				trace.node.endpoint = true;
			}
			else {
				trace.node.grow(notYetAdded);
			}
		}
		else {
			//no root is found, create new TrieNodes
			this.roots[entry[0]] = new TrieNode(entry);
		}
	};

	Trie.prototype.findRoot = function (query) {
		//attempts to find appropriate root given query;
		//  returns false if no such root exists

		return this.roots[query[0]] || false;
	};

	Trie.prototype.includes = function (query) {
		//returns true if there exists a Trie path matching entry;
		// returns false if entire entry is not already within Trie
		var rootNode = this.findRoot(query);
		if (rootNode === false) {
			return false;
		}
		else {
			var trace = this.traceQuery(query);

			if ((trace.value == query) && (trace.node.endpoint == true)) {
				return true;
			}
			else {
				return false;
			}
		}
		
	};

	Trie.prototype.possibleHits = function (query) {
		var trace = this.traceQuery(query);
		return trace.node.fetchComplete();
	};

	Trie.prototype.traceQuery = function (query) {
		//convenience function performs three steps:
		//  1. finds rootNode of query
		//  2. finds last node matching query
		//  3. returns last node and its combined value so far

		var rootNode = this.findRoot(query);
		var trailingNode = rootNode.findLastNode(query);
		return {node: trailingNode, value: trailingNode.valueSoFar()};
	};

	var TrieNode = Trieforce.TrieNode = function (entry) {
		//entry is a string
		this.value = entry[0];
		this.parent = false;
		this.endpoint = false;
		this.children = [];

		//we have already assigned the first character to this node,
		// so check if we are done (thus endpoint = true), or continue
		var restOfEntry = entry.slice(1);

		if (restOfEntry.length == 0) {
			this.endpoint = true;
		}
		else {
			this.grow(restOfEntry);
		}
	};

	TrieNode.prototype.grow = function (entry) {
		var newNode = new TrieNode(entry);
		this.children.push(newNode);
		newNode.parent = this;
	};

	TrieNode.prototype.findLastNode = function (query) {
		//assume we have found starting node; proceed to rest
		var nextQuery = query.slice(1);

		//find thelast node with satisfies the query given
		if (nextQuery.length === 0) {
			return this;
		}
		else {
			//find next node whose value value matches first char
			// of nextQuery

			for (var i = 0; i < this.children.length; i++) {
				var childNode = this.children[i];

				if (childNode.value === nextQuery[0]) {
					return childNode.findLastNode(nextQuery);
				}
			}

			//no child nodes continue this query, return up to this point
			return this;
		}

	};

	TrieNode.prototype.valueSoFar = function () {
		//from this node, keep traversing through parents
		// until root, returning the combined values string
		// from root to this node.
		var currNode = this;
		var currVal = this.value;
		
		while (currNode.parent !== false) {
			currVal = currNode.parent.value + currVal;
			currNode = currNode.parent;
		}
		return currVal;
	};

	TrieNode.prototype.fetchComplete = function () {
		//from this node, fetch sub-nodes' values and
		// combine them whole
		var results = [];

		if (this.endpoint) {
			results.push(this.value);
			return results;
		}
		else {



			
			this.children.forEach(function (childNode) {
				results.concat(childNode.fetchComplete());
				results = results.map(function (substring) {
					return this.value + substring;
				});
			});
		}

		return results;
	}

	TrieNode.prototype.search = function (query) {

	};

})(this);