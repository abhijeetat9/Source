class Calculator {
    constructor()
    {
        this.result = 0;
    }
    add(number)
    {
        this.result += number;
    }
    subtract(number)
    {
        this.result -= number;
    }
    multiply(number)
    {
        this.result *= number;
    }
    divide(number)
    {
        
        if(number === 0)
        {
            throw new Error('Number cannot be divided by 0');
        }
        this.result /= number;
    }
    clear()
    {
        this.result = 0;
    }

    getResult()
    {
        return this.result;
    }

    calculate(expression)
    {
        const cleanResult = expression.replace(/\s+/g, '');
        const newResult = /^[0-9+\-*/().]+$/.test(cleanResult);
        try {
            this.result = eval(cleanResult)
        } catch (error) {
            throw new Error("Invalid");
        }
        
        if(!newResult)
        {
            throw new Error("Invalid");
        }
        if(this.result === Infinity)
        {
            throw new Error("Infinity");
        }
        
    }
}

module.exports = Calculator;