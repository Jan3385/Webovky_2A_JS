const NaN_Const = "NaN";
let NumberDivs = [];

const NumberSystem = {
    BINARY: "2^n",
    OCTAL: "8^n",
    HEXADECIMAL: "16^n",
    DECIMAL: "10^n"
};

window.onload = function(){
    console.log("Okno načteno");

    //hlavní div
    NumberDivs.push(new NumberDiv("Desítková soustava", "mainDiv", 0, 
        NumberSystem.DECIMAL, true, 15, "92791738743"));

    NumberDivs.push(new NumberDiv("Binární soustava", "div1", 1, 
        NumberSystem.BINARY, false, 54, "10010100101"));
    NumberDivs.push(new NumberDiv("Oktálová soustava", "div2", 2, 
        NumberSystem.OCTAL, false, 17, "46152635261"));
    NumberDivs.push(new NumberDiv("Hexadecimální soustava", "div3", 3, 
        NumberSystem.HEXADECIMAL, false, 13, "3FF4D12DF"));

    NumberDivs[1].getElement().addEventListener("mouseup", function(){elementClickHandler(1)}, false);
    NumberDivs[2].getElement().addEventListener("mouseup", function(){elementClickHandler(2)}, false);
    NumberDivs[3].getElement().addEventListener("mouseup", function(){elementClickHandler(3)}, false);

    setInterval(animateBackground, 100);
    setInterval(rotát, 1);
}
let rot = 0;
function rotát(){
    if(shouldRotate){
        document.body.style.transform = "rotate(" + rot + "deg)";
        rot += 5;
    }
}
function animateBackground(){
    if(Math.floor(Math.random() * 4) <= 1) return;

    let r = Math.floor(Math.random() * 3);

    let element;
    let randomIndex;
    let stringArray;
    switch(r){
        case 1:
            element = document.getElementById("binaryBG");
            randomIndex = Math.floor(Math.random() * element.innerHTML.length);
            stringArray = element.innerHTML.split("");
            stringArray[randomIndex] = Math.floor(Math.random() * 2).toString(2);
            element.innerHTML = stringArray.join("");
            break;
        case 2:
            element = document.getElementById("hexadecimalBG");
            randomIndex = Math.floor(Math.random() * element.innerHTML.length);
            stringArray = element.innerHTML.split("");
            stringArray[randomIndex] = Math.floor(Math.floor(Math.random() * 16)).toString(16).toUpperCase();
            element.innerHTML = stringArray.join("");
            break;
        case 3:
            element = document.getElementById("decimalBG");
            randomIndex = Math.floor(Math.random() * element.innerHTML.length);
            stringArray = element.innerHTML.split("");
            stringArray[randomIndex] = Math.floor(Math.floor(Math.random() * 10).toString(10));
            element.innerHTML = stringArray.join("");
            break;
    
    }
}
function elementClickHandler(id) {
    let value = 0;
    let flip = false;
    NumberDivs.forEach((element) => {
        if(element.divId == id && !element.main && !flip){
            let tempMain = element.main;
            let tempDivEl = element.divElementId;
            let tempDivId = element.divId;

            let mainMain = getMainDiv().main;
            let mainDivEl = getMainDiv().divElementId;
            let mainDivId = getMainDiv().divId;

            value = element.getElement().querySelector("#value").innerHTML;
            if(value == "0" || value == NaN) value = "";

            getMainDiv().changeInfo(tempMain, tempDivEl, tempDivId);
            element.changeInfo(mainMain,mainDivEl, mainDivId);

            //for loop se zestaví
            flip = true;
        }
    });
    document.getElementById("input").value = value;
    onInput();
}
//změní číslo z libovolné soustavy na desítkovou a vrátí ji
function convertToDecimal(number, numberType){
    number = number.toString();
    if(number == "") number = 0;
    switch(numberType){
        case NumberSystem.BINARY:
            number = parseInt(number, 2);
            break;
        case NumberSystem.HEXADECIMAL:
            number = parseInt(number, 16);
            break;
        case NumberSystem.OCTAL:
            number = parseInt(number, 8);
            break;
        case NumberSystem.DECIMAL:
            number = parseInt(number, 10);
            break;
        default:
            number = 0;
            break;
    }
    return number;
}
function fromDecimalTo(number, numberType){
    let tempNum = parseFloat(number);
    switch(numberType){
        case NumberSystem.BINARY:
            tempNum = tempNum.toString(2);
            break;
        case NumberSystem.HEXADECIMAL:
            tempNum = tempNum.toString(16);
            tempNum = tempNum.toUpperCase();
            break;
        case NumberSystem.OCTAL:
            tempNum = tempNum.toString(8);
            break;
        case NumberSystem.DECIMAL:
            tempNum = tempNum.toString(10);
            break;
    }
    return tempNum;
}
//převede desítkové číslo na všechny soustavy a zobrazí je
function convertDecimalAndDisplay(number){
    //projde každou strukturou divu
    NumberDivs.forEach((element) => {
        let tempNum = parseFloat(number);
        if(!element.main){
            switch(element.conversionType){
                case NumberSystem.BINARY:
                    tempNum = tempNum.toString(2);
                    break;
                case NumberSystem.HEXADECIMAL:
                    tempNum = tempNum.toString(16);
                    tempNum = tempNum.toUpperCase();
                    break;
                case NumberSystem.OCTAL:
                    tempNum = tempNum.toString(8);
                    break;
                case NumberSystem.DECIMAL:
                    tempNum = tempNum.toString(10);
                    break;
            }
            if(tempNum == "NaN" || tempNum == "NAN") tempNum = NaN;
            element.setInfo(tempNum);
        }
    });
}
//struktura divů, obsahující potřebné informace a funkce
class NumberDiv{
    constructor(name, div, divId, conversionType, main, maxInputLength, example){
        this.name = name;
        this.divElementId = div;
        this.divId = divId;
        this.conversionType = conversionType;
        this.main = main;
        this.maxInputLength = maxInputLength;
        this.example = example;

        this.getElement().querySelector("#name").innerHTML = this.name;
    }
    changeInfo(main, elementId, divId){
        this.main = main;
        this.divElementId = elementId;
        this.divId = divId;

        this.getElement().querySelector("#name").innerHTML = this.name;
        if(this.main){
            getMainDiv().getElement().querySelector("#input").maxLength = this.maxInputLength;
        } else{
            this.getElement().querySelector("#equasion").innerHTML = this.conversionType;
            this.getElement().querySelector(".textDecoration").innerHTML = this.example;
            if(this.name == "Desítková soustava") this.getElement().querySelector("#name").style.backgroundColor = "rgb(0, 0, 0, 0.1)";
            else this.getElement().querySelector("#name").style.backgroundColor = "rgb(0, 0, 0, 0.0)";
        }
    }
    setInfo(number){
        if(!(this.divElementId == "mainDiv")){
            this.getElement().querySelector("#value").innerHTML = deleteDecimal(number);
        }
            
        this.getElement().querySelector("#length").innerHTML = "Délka " + deleteDecimal(number).length + " znak(ů)";
    } 
    getElement(){
        return document.getElementById(this.divElementId);
    }
}
let number = 0;
let prevNum = 0;
let shouldRotate = false;
//zavolá se při změně vstupu na hlavním divu
async function onInput(){
    number = document.getElementById("input").value;

    if(number == "rotate") shouldRotate = true;
    else shouldRotate = false;

    if(number == "") number = 0;

    getMainDiv().getElement().querySelector("#length").innerHTML = "Délka " + 
                (number.toString().length) + " znak(ů)";

    getMainDiv().getElement().querySelector("#bitLength").innerHTML = "Velikost " + 
                (parseInt(number).toString(2).length) + " bitů";
    
    number = convertToDecimal(number, getMainDiv().conversionType);

    for(let i = 0; i <= 1; i+=0.1){
        await sleep(20);
        convertDecimalAndDisplay(lerp(prevNum, number, i));
    }

    prevNum = number;
}
function CopyNumber(id){
    NumberDivs.forEach((element) => {
        if(element.divId == id && !element.main){
            let text = element.getElement().querySelector("#value").innerHTML;

            //zkopíruje text do schránky
            navigator.clipboard.writeText(text);

            alert("Číslo bylo zkopírováno do schránky");
        }
    });
}   
//vrátí strukturu divu, která je označena jako hlavní
function getMainDiv(){
    let mainElement = null;
    NumberDivs.forEach((element) => {
        if(element.main) mainElement = element;
    });
    return mainElement;
} 
function inputRandomNumber(length){
    let number = Math.random() * Math.pow(10, length);
    number = Math.floor(number);
    number = fromDecimalTo(number, getMainDiv().conversionType);

    getMainDiv().getElement().querySelector("#input").value = number;
    onInput();  
}
function resetNumbers(){
    getMainDiv().getElement().querySelector("#input").value = "";
    onInput();  
}
function lerp(start, end, t){
    if(t > 0.95) return end;
    return start + (end - start) * t;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function deleteDecimal(expression){
    let nonDecimalNum = expression.toString().split(".")[0]
    return nonDecimalNum;
}