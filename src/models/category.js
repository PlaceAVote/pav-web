function Category(cat, c) {
  switch(cat) {
    case 'userissue' : {
      return c('following');
    }
    case 'vote' : {
      return c('billActivity');
    }
    case 'comment' : {
      return c('billActivity');
    }
    case 'bill' : {
      return c('billActivity');
    }
  }
};

module.exports = Category;
