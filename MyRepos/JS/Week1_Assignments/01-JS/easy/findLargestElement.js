function findLargestElement(numbers)
{
    let largestNumber = numbers[0];
    for(let i = 0; i <= numbers.length; i++)
    {
        if(numbers[i] > largestNumber)
        {
            largestNumber = numbers[i];
        }
    }
    return largestNumber;
}

module.exports = findLargestElement;