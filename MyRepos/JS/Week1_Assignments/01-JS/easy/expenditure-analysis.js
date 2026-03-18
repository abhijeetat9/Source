function calculateTotalSpentByCategory(transactions) {
    
    const categoryTotals = {};
    transactions.forEach(transaction => {
        const {category, price} = transaction;

        if(category in categoryTotals)
        {
            categoryTotals[category] += price;
        }else
        {
            categoryTotals[category] = price;
        }
    });

    const result = Object.keys(categoryTotals).map(category => ({category: category, totalSpent: categoryTotals[category]}));
    return  result;
  }
  
  //const result = calculateTotalSpentByCategory(transactions);
  module.exports = calculateTotalSpentByCategory;