/* Array operations */

/**
 * Utility function to return the shortened keypath and the index.
 */
Ractive.defaults.list_splitKeypath = function(keypath) {
	if( !keypath ) {
		throw "Missing keypath argument"
	}
	var dot = keypath.lastIndexOf("."); 
	return {
		keypath: keypath.substring(0, dot),
		index: parseInt( keypath.substring(dot+1) )
	}
}

/**
 * Adds 'val' to the list. Unlike push, it also creates the list if it does not yet exist.
 * Returns a Promise.
 */
Ractive.defaults.list_add = function( keypath, val ) {
	var list = this.get( keypath )
	if( list )
		return this.push(keypath, val)
	else
		return this.set(keypath, [val])
}

/**
 * Removes the item at the given keypath.
 * Returns a Promise.
 */
Ractive.defaults.list_del = function(keypath) {
	var ki = this.list_splitKeypath(keypath)
	return this.splice( ki.keypath, ki.index, 1 )
}

/**
 * Swap item with the previous one.
 * Returns a Promise.
 */
Ractive.defaults.list_up = function(keypath) {
	var ki = this.list_splitKeypath(keypath)
	return this.list_move(ki.keypath, ki.index, ki.index-1)
}

/**
 * Swap item with the next one.
 * Returns a Promise.
 */
Ractive.defaults.list_down = function(keypath) {
	var ki = this.list_splitKeypath(keypath)
	return this.list_move(ki.keypath, ki.index, ki.index+1)
}

/**
 * Given the keypath of the list, moves an item from a position to another.
 * Returns a Promise.
 */
Ractive.defaults.list_move = function(keypath, from, to) {
	var len = this.get(keypath + '.length')
	if( from < 0 || from >= len || to < 0 || to >= len )
		return
		
	var val = this.get(keypath + '.' + from)
	var self = this
	
	return this.splice(keypath, from, 1).then(function() {
		return self.splice(keypath, to, 0, val)
	})
}
