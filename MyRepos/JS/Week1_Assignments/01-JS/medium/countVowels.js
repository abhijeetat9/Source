function countVowels(str) {
    const strBeLowerCase = str.toLowerCase();
    let vowelCount = 0;
    // for(let char of strBeLowerCase)
    // {
    //     if('aeiou'.includes(char))
    //     {
    //         vowelCount++;
    //     }
    // }
    // return vowelCount;
    for(let i = 0; i < strBeLowerCase.length; i++)
    {
        const char = strBeLowerCase[i];
        if('aeiou'.includes(char))
        {
            vowelCount++;
        }
    }
    return vowelCount;
}

module.exports = countVowels;