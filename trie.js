(function (root) {
	var Trieforce = root.Trieforce = (root.Trieforce || {});

	var Trie = Trieforce.Trie = function (entry, options) {
		//Trie handles all TrieNodes and keeps track of their roots
		this.roots = [];

		//entry can be a string, or array of strings
		if (typeof(entry) == 'string') {

		} else {
			//entry is an object
		}
	};

	Trie.prototype.add = function (entry) {
		//adds entry to correct root node, or creates
		// new node if no such root exists
		var root = this.findRoot(entry);

		if (root != false) {
			//root is found, find the last subnode possible
			// and grow from there

			var leaf = root.findLastNode(entry);
			var alreadyAdded = leaf.valueSoFar();
			var notYetAdded = entry.slice(alreadyAdded.length);
			leaf.grow(notYetAdded);
		}
		else {
			//no root is found, create new TrieNodes
			this.roots.push(new TrieNode(entry));
		}
	};

	Trie.prototype.findRoot = function (query) {
		//attempts to find appropriate root given query;
		//  returns false if no such root exists
		this.roots.forEach(function (rootNode) {
			if (rootNode.value == query[0]) {
				return rootNode;
			}
		});

		return false;
	};

	Trie.prototype.includes = function (query) {
		//returns true if there exists a Trie path matching entry;
		// returns false if entire entry is not already within Trie
		if (this.findRoot(query) == false) {
			return false;
		}

		
	};

	var TrieNode = Trieforce.TrieNode = function (entry) {
		//entry is a string
		this.value = entry[0];
		this.parent = false;
		this.children = [];

		if (entry != '') {
			this.grow(entry.slice(1));
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
		if (nextQuery == '') {
			return this;
		}
		else {
			//find next node whose value value matches first char
			// of nextQuery
			
			this.children.forEach(function (childNode) {
				if (childNode.value == nextQuery[0]) {
					return childNode.findLastNode(nextQuery);
				}
			});

		}

	};

	TrieNode.prototype.valueSoFar = function () {
		//from this node, keep traversing through parents
		// until root, returning the combined values string
		// from root to this node.
		var currNode = this;
		var currVal = this.value;
		
		while (currNode.parent != false) {
			currVal = currNode.parent.value + currVal;
			currNode = currNode.parent;
		}
		return currVal;
	};

	TrieNode.prototype.fetchComplete = function () {
		//from this node, fetch sub-nodes' values and
		// combine them whole
		var results = [];

		if (this.children.length == 0) {
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