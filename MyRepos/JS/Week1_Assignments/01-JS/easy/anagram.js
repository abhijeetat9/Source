function isAnagram(str1,str2)
{
    let l1 = str1.toLowerCase().split("").sort().join("");
    let l2 = str2.toLowerCase().split("").sort().join("");

    if(l1 != l2)
    {
        return false;
    }
    
    for(let i=0;i<l1;i++)
    {
        if(str1[i] != str2[i])
            return false;
    }
    return true;
}
module.exports = isAnagram;