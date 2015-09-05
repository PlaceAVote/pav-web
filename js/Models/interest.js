function Interest(name, icon){
	this.name = name;
	this.icon = icon;
	this.selected = false;
	this.select = function(){
		this.selected = this.selected ? false : true;
	}
}

module.exports = Interest;
