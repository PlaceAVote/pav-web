function Icon(options, c) {
    var that = this;
    if(!options.subject) {
        return c('icon-building');
        
    }
    var i = options.subject;
    if(i == 'Religion') {
        return c('icon-religion');
    }   
    if(i == 'Drugs') {
        return c('icon-smoking-area');
    }
    if(i == 'Defense') {
        return c('icon-tank');
    }    
    if(i == 'Politics') {
        return c('icon-building');
    }
    if(i == 'Gun Rights') {
        return c('icon-gun');
    }
    if(i == 'Technology') {
        return c('icon-ipad');
    }
    if(i == 'Economics') {
        return c('icon-money');
    }
    if(i == 'Social Interest') {
        return c('icon-police');
    }
    return c('icon-building');
}

module.exports = Icon;